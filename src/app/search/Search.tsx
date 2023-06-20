import {
  LoadingOverlay,
  Space,
  Box,
  Loader,
  Text,
  Center,
} from "@mantine/core";
import { SearchParams } from "../../lib/databaseTypes";

import { useEffect, useState } from "react";
import { Course } from "@prisma/client";
import SearchForm from "./SearchForm";
import SearchResults from "./SearchResults";
import { useForm } from "@mantine/form";

export default function Search() {
  const form = useForm<SearchParams>({
    initialValues: {
      searchQuery: "",
      departmentsAny: [],
      number: "",
      schoolsAny: [],
      title: "",
      courseLevel: "",
      unitsMin: undefined,
      unitsMax: undefined,
      prerequisitesNot: "",
      restrictionsNot: [],
      ignore: [],
      geAll: [],
      geAny: [],
      term: "",
      orderBy: "department",
      orderByDirection: "asc",
      page: 0,
      pageSize: 20,
    },
  });

  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Course[]>([]);

  async function updateCourses() {
    setIsUpdating(true);
    const t = new Date();
    await fetch("/api/course/update", {
      method: "PUT",
    });
    console.log(new Date().getTime() - t.getTime());
    setIsUpdating(false);
  }

  async function shouldUpdate() {
    // return true;
    const t = new Date();
    const resp = await fetch("/api/course/shouldUpdate");
    const data = await resp.json();
    console.log(new Date().getTime() - t.getTime());
    return data.shouldUpdate;
  }

  async function maybeUpdateCourses() {
    if (await shouldUpdate()) {
      await updateCourses();
    }
  }

  useEffect(() => {
    maybeUpdateCourses();
  }, []);

  function getURLSearchParams(page: number): URLSearchParams {
    const urlSearchParams = new URLSearchParams({
      searchQuery: form.values.searchQuery || "",
      number: form.values.number || "",
      title: form.values.title || "",
      courseLevel: form.values.courseLevel || "",
      term: form.values.term || "",
      orderBy: form.values.orderBy || "",
      orderByDirection: form.values.orderByDirection || "",
      prerequisitesNot: form.values.prerequisitesNot || "",
      unitsMin: form.values.unitsMin ? form.values.unitsMin.toString() : "",
      unitsMax: form.values.unitsMax ? form.values.unitsMax.toString() : "",
      restrictionsNot: form.values.restrictionsNot
        ? form.values.restrictionsNot.join(",")
        : "",
      department: form.values.departmentsAny
        ? form.values.departmentsAny.join(",")
        : "",
      school: form.values.schoolsAny ? form.values.schoolsAny.join(",") : "",
      geAnd: form.values.geAll ? form.values.geAll.join(",") : "",
      geOr: form.values.geAny ? form.values.geAny.join(",") : "",
      page: page.toString(),
      pageSize: form.values.pageSize ? form.values.pageSize.toString() : "",
    });
    return urlSearchParams;
  }

  async function fetchCourses(page: number): Promise<Course[]> {
    const t = new Date();
    const urlSearchParams = getURLSearchParams(page);
    const resp = await fetch(
      "/api/course/search?" + urlSearchParams.toString()
    );
    const data = await resp.json();
    console.log(new Date().getTime() - t.getTime());
    console.log(data);
    const courses: Course[] = data.courses as Course[];
    return courses;
  }

  async function searchCourses() {
    if (isUpdating) {
      return;
    }
    setSearchResults([]);
    setIsLoading(true);
    form.setFieldValue("page", 0);
    const courses = await fetchCourses(0);
    setSearchResults(courses);
    setHasMoreCourses(true);
    setIsLoading(false);
  }

  useEffect(() => {
    searchCourses();
  }, [form.values.orderBy, form.values.orderByDirection]);

  const [hasMoreCourses, setHasMoreCourses] = useState<boolean>(false);

  async function loadMoreCourses() {
    setIsLoadingMore(true);
    const newCourses = await fetchCourses(form.values.page || 0 + 1);
    if (newCourses.length == 0) {
      setHasMoreCourses(false);
      return;
    }
    form.setFieldValue("page", form.values.page || 0 + 1);
    setSearchResults(searchResults.concat(newCourses));
    setIsLoadingMore(false);
  }

  return (
    <Box>
      <SearchForm form={form} searchCourses={searchCourses} />
      <Space h="md" />
      <SearchResults
        loadMoreCourses={loadMoreCourses}
        hasMoreCourses={hasMoreCourses}
        searchResults={searchResults}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
      />
      <LoadingOverlay
        loader={
          <Box>
            <Text>Updating the course database! This may take a while...</Text>
            <Center>
              <Loader />
            </Center>
          </Box>
        }
        visible={isUpdating}
      />
    </Box>
  );
}
