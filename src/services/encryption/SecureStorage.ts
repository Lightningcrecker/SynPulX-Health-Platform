import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export class SecureStorage {
  private static readonly SALT_ROUNDS = 12;
  private static readonly KEY_SIZE = 256;
  private static readonly ITERATION_COUNT = 100000;

  private static instance: SecureStorage;
  private encryptionKey: string;

  private constructor() {
    this.encryptionKey = localStorage.getItem('masterKey') || this.generateMasterKey();
  }

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  private generateMasterKey(): string {
    const masterKey = uuidv4();
    localStorage.setItem('masterKey', masterKey);
    return masterKey;
  }

  private deriveKey(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: this.KEY_SIZE / 32,
      iterations: this.ITERATION_COUNT
    }).toString();
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SecureStorage.SALT_ROUNDS);
  }

  public async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public encrypt(data: any): string {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const key = this.deriveKey(this.encryptionKey, salt.toString());
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const combined = salt.toString() + iv.toString() + encrypted.toString();
    return combined;
  }

  public decrypt(encryptedData: string): any {
    const salt = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
    const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(32, 32));
    const encrypted = encryptedData.substring(64);

    const key = this.deriveKey(this.encryptionKey, salt.toString());

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  public setItem(key: string, value: any): void {
    const encrypted = this.encrypt(value);
    localStorage.setItem(key, encrypted);
  }

  public getItem<T>(key: string): T | null {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return this.decrypt(encrypted);
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}