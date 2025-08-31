import { createConfig, http } from 'wagmi';
import { base, bsc, bscTestnet, mainnet, sepolia } from 'wagmi/chains';
import { metaMask, walletConnect } from 'wagmi/connectors';

const walletConnectId = '302807dcc62c9dd68329f7bf2ba9f73a';

export const wagmiConfig = createConfig({
  chains: [mainnet, base, bsc, bscTestnet, base, sepolia],
  connectors: [
    metaMask({ enableAnalytics: false }),
    walletConnect({
      projectId: walletConnectId,
      qrModalOptions: {
        themeVariables: {
          '--wcm-z-index': '3000',
        },
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [bscTestnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
