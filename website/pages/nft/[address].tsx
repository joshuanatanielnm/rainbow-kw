import { Box, Flex, Heading, Image, Stack, Text, Wrap } from "@chakra-ui/react";
import { Cancel } from "iconoir-react";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import Modal from "react-modal";
import { MarketPlaceButton } from "ui/core/marketplace-button";

import type { Nft } from "../../types/nft";
import type { Rainbow } from "../../types/rainbow";

Modal.setAppElement("#__next");

export interface NftPageProps {
  data: Nft;
}

const RAINBOW_ENDPOINT =
  "https://rainbow.me/api/assets?network=ethereum&address=0x241654d47b37fbece8660a6c2e2893106e623a8d&cursor=start";

const NFT_ENDPOINT = "https://rainbow.me/api/asset?uniqueId=ethereum_";

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(RAINBOW_ENDPOINT);
  const json = (await response.json()) as Rainbow;

  const paths = json.results.map((rainbow) => {
    return {
      params: { address: `${rainbow.asset_contract.address}_${rainbow.token_id}` },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const address = params?.address as string;
  const response = await fetch(`${NFT_ENDPOINT}${address}`);
  const data = (await response.json()) as NftPageProps;

  return {
    props: { data },
  };
};

export function NftPage({ data }: NftPageProps) {
  const router = useRouter();

  const handleClick = () => {
    void (async () => {
      await router.push("/");
    })();
  };

  return (
    <>
      <Box
        bg="white"
        cursor="pointer"
        m="6"
        onClick={handleClick}
        p="2"
        position="absolute"
        right="0"
        rounded="full"
        top="0"
        zIndex={999}
      >
        <Cancel height="20" strokeWidth="4" width="20" />
      </Box>
      <Modal
        contentLabel="Post modal"
        isOpen
        onRequestClose={handleClick}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            border: "none",
            padding: "20px",
            background: "none",
            maxHeight: "100vh",
            maxWidth: "100vw",
          },
          overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Flex direction={{ base: "column", lg: "row" }} gap={6} maxW="100vw">
          <Box boxShadow="lg" height="full" overflow="hidden" rounded="3xl" w={{ base: "80vw", md: "50vw" }}>
            <Image alt={data.name} h="full" src={data.image_url} w="full" />
          </Box>
          <Box w="full">
            <Stack bg="white" boxShadow="xl" p="7" rounded="2xl" w="full">
              <Flex align="center" gap="1">
                <Image
                  alt={data.asset_contract.name}
                  boxShadow="lg"
                  boxSize="20px"
                  rounded="full"
                  src={data.asset_contract.image_url}
                />
                <Text color="gray.400" fontWeight="medium">
                  {data.asset_contract.name}
                </Text>
              </Flex>
              <Heading as="h1" fontSize="2xl">
                {data.name}
              </Heading>
              <Flex flexWrap="wrap" gap="2">
                <MarketPlaceButton
                  link={`https://opensea.io/assets/ethereum/${data.asset_contract.address}/${data.token_id}`}
                  src="/assets/opensea.png"
                  title="OpenSea"
                />
                <MarketPlaceButton
                  link={`https://rarible.com/token/${data.asset_contract.address}:${data.token_id}?tab=details`}
                  src="/assets/rarible.png"
                  title="Rarible"
                />
                <MarketPlaceButton
                  link={`https://etherscan.io/token/${data.asset_contract.address}?a=${data.token_id}`}
                  src="/assets/etherscan.png"
                  title="Etherscan"
                />
              </Flex>

              {data.description && (
                <>
                  <Text fontSize="xl" fontWeight="bold" pt="8">
                    Description
                  </Text>
                  <Text color="gray.400">{data.description}</Text>
                </>
              )}

              {data.traits.length > 0 && (
                <>
                  <Text fontSize="xl" fontWeight="bold" pt="10">
                    Attributes
                  </Text>
                  <Wrap>
                    {data.traits.map((trait) => (
                      <Box key={trait.display_type} bg="gray.100" borderRadius="xl" color="gray.400" px="3" py="2">
                        <Text fontSize="xs" fontWeight="bold">
                          {trait.trait_type}
                        </Text>
                        <Text fontSize="md" mt="-1">
                          {trait.value}
                        </Text>
                      </Box>
                    ))}
                  </Wrap>
                </>
              )}
            </Stack>
          </Box>
        </Flex>
      </Modal>
    </>
  );
}

export default NftPage;
