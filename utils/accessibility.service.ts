// services/accessibility.service.ts
export const getAccessibilityPreferences = async (userId: string) => {
    const user = await User.findById(userId).select('accessibility');
    return user?.accessibility || {
      highContrast: false,
      textSize: 'normal',
      screenReader: false,
      captions: true
    };
  };
  
  export const adjustVideoPlayer = (playerElement: HTMLElement, preferences: any) => {
    if (preferences.highContrast) {
      playerElement.style.filter = 'contrast(1.5)';
    }
    if (preferences.textSize === 'large') {
      // Adjust UI text sizes
    }
    // Other adjustments
  };