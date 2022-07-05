import { Box, Container, Heading, Image, Text } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Link from "next/link";
import { GalleryLayout } from "ui/layout";

import type { Rainbow } from "../types/rainbow";

const ENDPOINT =
  "https://rainbow.me/api/assets?network=ethereum&address=0x241654d47b37fbece8660a6c2e2893106e623a8d&cursor=start";

export interface HomePageProps {
  data: Rainbow["results"];
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(ENDPOINT);
  const json = (await response.json()) as Rainbow;

  const data = json.results.filter((val) => {
    return val.token_id !== "0";
  });

  return {
    props: { data },
  };
};

export default function HomePage({ data }: HomePageProps) {
  return (
    <Box>
      <Container maxW="6xl" py="10">
        <Heading as="h1" pb="4" size="xl">
          Rainbow Clown
        </Heading>

        <GalleryLayout>
          {data.map((rainbow) => {
            return (
              <Box key={rainbow.token_id}>
                <Link as={`/nft/${rainbow.asset_contract.address}_${rainbow.token_id}`} href="/nft/[address]" passHref>
                  <Box
                    _hover={{
                      transform: "scale(1.05)",
                      transition: "0.2s",
                    }}
                    cursor="pointer"
                    display="block"
                    h="0"
                    overflow="hidden"
                    paddingBottom="100%"
                    position="relative"
                    rounded="2xl"
                    shadow="2xl"
                    w="100%"
                  >
                    <Image
                      alt={rainbow.metadata.name ?? rainbow.token_id}
                      h="full"
                      objectFit="cover"
                      objectPosition="center"
                      position="absolute"
                      src={rainbow.metadata.image_url}
                      w="full"
                    />
                  </Box>
                </Link>
                <Text color="gray.400" fontSize="sm" fontWeight="bold" pl="2" pt="1">
                  {rainbow.metadata.name ?? rainbow.token_id}
                </Text>
              </Box>
            );
          })}
        </GalleryLayout>
      </Container>
    </Box>
  );
}
