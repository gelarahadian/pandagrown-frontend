import { configureChains, createConfig } from "wagmi";
import { bsc, mainnet, bscTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

const projectId = process.env.REACT_APP_PROJECT_ID;

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    bsc
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'PandaGrown Token',
  projectId: projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

