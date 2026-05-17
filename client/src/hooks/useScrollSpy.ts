import { useState, useEffect, useRef } from 'react';

export const useScrollSpy = (sectionIds: string[], defaultSection: string) => {
  const [activeSection, setActiveSection] = useState<string>(defaultSection);
  const isClickScrolling = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isClickScrolling.current) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  const scrollTo = (id: string) => {
    isClickScrolling.current = true;
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    setTimeout(() => {
      isClickScrolling.current = false;
    }, 800);
  };

  return { activeSection, scrollTo };
};
