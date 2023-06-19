import {
  Container,
  TextInput,
  ActionIcon,
  Group,
  Drawer,
  Button,
  MultiSelect,
  Select,
  NumberInput,
  Text,
  Space,
  Divider,
  Stack,
  SegmentedControl,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UseFormReturnType } from "@mantine/form";
import { FilterOptions, SearchParams } from "../../lib/databaseTypes";

import {
  IconArrowRight,
  IconSearch,
  IconAdjustmentsHorizontal,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function SearchForm({
  form,
  searchCourses,
}: {
  form: UseFormReturnType<SearchParams, (values: SearchParams) => SearchParams>;
  searchCourses: (params: SearchParams) => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  async function getFilterOptions() {
    const resp = await fetch("/api/course/filterOptions");
    const data = await resp.json();
    setFilterOptions(data);
  }
  useEffect(() => {
    getFilterOptions();
  }, []);

  const [restrictionsNotSearch, setRestrictionsNotSearch] =
    useState<string>("");

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark" ? theme.colors.dark[7] : "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 30,
      })}
    >
      <Container>
        <Space h="md" />
        <form onSubmit={form.onSubmit((values) => searchCourses(values))}>
          <Drawer
            opened={opened}
            onClose={() => {
              close();
              searchCourses(form.values);
            }}
            title="Filters"
          >
            <MultiSelect
              data={
                filterOptions?.departments?.map((department) => ({
                  value: department.text,
                  label: `(${department.text}) ${department.name}`,
                })) || []
              }
              label="Department"
              {...form.getInputProps("departmentsAny")}
              nothingFound="Nothing found"
            />
            <TextInput
              placeholder="E.g. 122A"
              label="Course Number"
              {...form.getInputProps("number")}
            />
            <TextInput
              placeholder="E.g. Introduction to Data Management"
              label="Course Title"
              {...form.getInputProps("title")}
            />
            <MultiSelect
              data={
                filterOptions?.schools?.map((school) => ({
                  value: school.text,
                  label: school.text,
                })) || []
              }
              label="School"
              {...form.getInputProps("schoolsAny")}
              nothingFound="Nothing found"
            />
            <Select
              label="Course Level"
              data={[{ value: "", label: "Any" }].concat(
                filterOptions?.courseLevels?.map((courseLevel) => ({
                  value: courseLevel.text,
                  label: courseLevel.text,
                })) || []
              )}
              {...form.getInputProps("courseLevel")}
              nothingFound="Nothing found"
            />
            <NumberInput
              label="Min. # of Units"
              {...form.getInputProps("unitsMin")}
            />
            <NumberInput
              label="Max. # of Units"
              {...form.getInputProps("unitsMax")}
            />
            <MultiSelect
              data={
                filterOptions?.restrictions?.map(
                  (restriction) => restriction.text
                ) || []
              }
              label="Has none of the restrictions:"
              searchable
              {...form.getInputProps("restrictionsNot")}
              searchValue={restrictionsNotSearch}
              onSearchChange={setRestrictionsNotSearch}
              nothingFound="Nothing found"
            />
            <TextInput
              placeholder="E.g. CS 122A, CS 132"
              label="Has none of the prerequisites (separated by commas):"
              {...form.getInputProps("prerequisitesNot")}
            />
            <MultiSelect
              data={filterOptions?.ges?.map((ge) => ge.text) || []}
              label="All of these GEs:"
              searchable
              {...form.getInputProps("geAll")}
              nothingFound="Nothing found"
            />
            <MultiSelect
              data={filterOptions?.ges?.map((ge) => ge.text) || []}
              label="Any of these GEs:"
              searchable
              {...form.getInputProps("geAny")}
              nothingFound="Nothing found"
            />
            <Select
              data={[{ value: "", label: "Any" }].concat(
                filterOptions?.terms?.map((term) => ({
                  value: `${term.year} ${term.quarter}`,
                  label: `${term.year} ${term.quarter}`,
                })) || []
              )}
              label="Term:"
              {...form.getInputProps("term")}
              nothingFound="Nothing found"
            />
            <Space h="md" />
            <Group>
              <Button
                onClick={() => {
                  close();
                  searchCourses(form.values);
                }}
                variant="outline"
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  form.reset();
                }}
                color="red"
                variant="outline"
              >
                Reset
              </Button>
            </Group>
          </Drawer>
          <Stack>
            <TextInput
              icon={<IconSearch size="1.1rem" stroke={1.5} />}
              radius="xl"
              size="md"
              rightSection={
                <ActionIcon size={32} radius="xl" type="submit">
                  <IconArrowRight size="1.1rem" stroke={1.5} />
                </ActionIcon>
              }
              {...form.getInputProps("searchQuery")}
              placeholder="Search courses..."
              rightSectionWidth={42}
            />
            <Group spacing="xs">
              <Button
                variant="outline"
                onClick={open}
                rightIcon={<IconAdjustmentsHorizontal />}
                radius="xl"
              >
                Filters
              </Button>
              <Group spacing="xs">
                <Text fz="sm">Sort By:</Text>
                <Select
                  data={[
                    { label: "Department #", value: "department" },
                    { label: "Average GPA", value: "averageGPA" },
                  ]}
                  {...form.getInputProps("orderBy")}
                />
                <SegmentedControl
                  {...form.getInputProps("orderByDirection")}
                  data={[
                    { label: "Ascending", value: "asc" },
                    { label: "Descending", value: "desc" },
                  ]}
                />
              </Group>
            </Group>
            <Divider />
          </Stack>
        </form>
      </Container>
    </Box>
  );
}
