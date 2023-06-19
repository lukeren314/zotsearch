import { AppShell } from "@mantine/core";

import AppHeader from "./AppHeader";
import Search from "../search/Search";
export default function Root() {
  return (
    <AppShell>
      <AppHeader />
      <Search />
    </AppShell>
  );
}
