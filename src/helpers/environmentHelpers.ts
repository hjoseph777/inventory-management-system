export const isHostedOnGitHub = (): boolean => {
  return window.location.hostname.includes('github.io');
};