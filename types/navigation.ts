export type RootStackParamList = {
  Onboarding: undefined;
  Home: {
    appName: string;
    milestoneType: 'Tree' | 'Pet' | 'Soldier';
  };
  BlockPopup: {
    appName: string;
  };
  AppSelect: undefined;
  Milestone: {
    milestoneType: 'Tree' | 'Pet' | 'Soldier';
  };
  LifeSavings: undefined;
};