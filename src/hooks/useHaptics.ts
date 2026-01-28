import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export function useHaptics() {
  const isNative = Capacitor.isNativePlatform();

  const lightImpact = async () => {
    if (isNative) {
      await Haptics.impact({ style: ImpactStyle.Light });
    }
  };

  const selectionChanged = async () => {
    if (isNative) {
      await Haptics.selectionChanged();
    }
  };

  return { lightImpact, selectionChanged };
}
