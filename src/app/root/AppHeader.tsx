import {
  useMantineTheme,
  ActionIcon,
  Group,
  Space,
  Title,
  useMantineColorScheme,
  Switch,
  Box,
  rem,
  Tooltip,
} from "@mantine/core";
import {
  IconSun,
  IconMoonStars,
  IconQuestionMark,
  IconBug,
} from "@tabler/icons-react";
import Link from "next/link";
export default function AppHeader() {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Box>
      <Space h="xs" />
      <Title order={3} ta="center" color={theme.colors.blue[5]}>
        ZotSearch
      </Title>
      <Box
        sx={() => ({
          position: "absolute",
          top: rem(20),
          right: rem(20),
        })}
      >
        <Group spacing="xs">
          <Tooltip label="Report a bug">
            <ActionIcon radius="xl">
              <Link href="https://forms.gle/YqjNS9aMKFKrSTcM7" target="_blank">
                <IconBug />
              </Link>
            </ActionIcon>
          </Tooltip>
          <Tooltip label="About">
            <ActionIcon radius="xl">
              <IconQuestionMark />
            </ActionIcon>
          </Tooltip>
          <Switch
            checked={colorScheme === "dark"}
            onChange={() => toggleColorScheme()}
            size="lg"
            onLabel={
              <IconSun color={theme.white} size="1.25rem" stroke={1.5} />
            }
            offLabel={
              <IconMoonStars
                color={theme.colors.gray[6]}
                size="1.25rem"
                stroke={1.5}
              />
            }
          />
        </Group>
      </Box>
    </Box>
  );
}
