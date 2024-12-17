export const smoothScroll = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  });
};

export const useScrollSpy = (sectionIds: string[], offset: number = 100): string | null => {
  let activeSection: string | null = null;

  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);

  sections.forEach(section => {
    const sectionTop = section.offsetTop - offset;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      activeSection = section.id;
    }
  });

  return activeSection;
};