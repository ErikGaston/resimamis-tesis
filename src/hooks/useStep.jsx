import React, { useCallback, useState } from 'react'

export const useStep = (initialStep = 0, lastStep=1) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    if (currentStep < lastStep) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const resetStep = useCallback((value) => {
    setCurrentStep(value? value :initialStep)
  }, [currentStep]);

  return { currentStep, nextStep, prevStep, resetStep };
}