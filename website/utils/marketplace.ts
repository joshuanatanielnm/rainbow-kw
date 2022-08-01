interface MarketPlaceDataProps {
  address: string;
  tokenId: string;
}

export const marketPlaceData = ({ address, tokenId }: MarketPlaceDataProps) => {
  return [
    {
      link: `https://opensea.io/assets/ethereum/${address}/${tokenId}`,
      src: "/assets/opensea.png",
      title: "OpenSea",
    },
  ];
};
