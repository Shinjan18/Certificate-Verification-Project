/**
 * Scroll to a specific section with smooth behavior
 * @param elementId - The ID of the element to scroll to
 */
export const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    // Set focus to the element for screen readers
    element.tabIndex = -1;
    element.focus();
    
    // Scroll to the element
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};