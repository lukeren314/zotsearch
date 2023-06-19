import {
  Container,
  Card,
  Text,
  Grid,
  SegmentedControl,
  ScrollArea,
  Select,
} from "@mantine/core";
import { Course } from "@prisma/client";
import { useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function CourseCard({ course }: { course: Course }) {
  const [gradeIndex, setGradeIndex] = useState<number>(0);
  return (
    <Card shadow="sm" radius="md" withBorder>
      <Grid>
        <Grid.Col sm={12} md={6} lg={6}>
          <Text fz="lg" weight={500}>
            {course.departmentNumber}. {course.title}.{" "}
            {course.unitsMin == course.unitsMax
              ? `${course.unitsMin} Units`
              : `${course.unitsMin}-${course.unitsMax} Units`}
            .
          </Text>
          <Text c="dimmed">{course.description}</Text>
          {course.prerequisiteText ? (
            <Text>Prerequisites: {course.prerequisiteText}</Text>
          ) : null}
          {course.repeatability ? (
            <Text>Repeatability: {course.repeatability}</Text>
          ) : null}
          {course.gradingOption ? (
            <Text>Grading Option: {course.gradingOption}</Text>
          ) : null}
          {course.concurrent ? (
            <Text>Concurrent: {course.concurrent}</Text>
          ) : null}
          {course.sameAs ? <Text>Same As: {course.sameAs}</Text> : null}
          {course.overlap ? <Text>Overlap: {course.overlap}</Text> : null}
          {course.corequisite ? (
            <Text>Corequisite: {course.corequisite}</Text>
          ) : null}
          {course.restrictionText ? (
            <Text>Restrictions: {course.restrictionText}</Text>
          ) : null}
          {course.geText ? (
            <Text>General Education: {course.geText}</Text>
          ) : null}
          {course.terms && course.terms.length ? (
            <Text>Terms: {course.terms.join(", ")}</Text>
          ) : null}
        </Grid.Col>
        <Grid.Col sm={12} md={6} lg={6}>
          {/* <Group position="right">
            <Button
              variant="outline"
              color="red"
              onClick={() => {
                if (!(course.departmentNumber in ignore.split(","))) {
                  setIgnore(ignore + `${course.departmentNumber},`);
                  // setSearchResults(
                  //   searchResults
                  //     .slice(0, index)
                  //     .concat(searchResults.slice(index + 1))
                  // );
                }
              }}
            >
              Ignore
            </Button>
          </Group> */}
          {course.averageGPA != null ? (
            <Container>
              <Select
                data={
                  course.instructors?.sort().map((instructor, index) => ({
                    label: instructor,
                    value: index.toString(),
                  })) || []
                }
                value={gradeIndex.toString()}
                onChange={(index) => index && setGradeIndex(parseInt(index))}
              />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      label: "A",
                      value: course.gradeACounts[gradeIndex],
                    },
                    {
                      label: "B",
                      value: course.gradeBCounts[gradeIndex],
                    },
                    {
                      label: "C",
                      value: course.gradeCCounts[gradeIndex],
                    },
                    {
                      label: "D",
                      value: course.gradeDCounts[gradeIndex],
                    },
                    {
                      label: "F",
                      value: course.gradeFCounts[gradeIndex],
                    },
                    {
                      label: "P",
                      value: course.gradePCounts[gradeIndex],
                    },
                    {
                      label: "NP",
                      value: course.gradeNPCounts[gradeIndex],
                    },
                  ].map(({ label, value }) => ({
                    label,
                    Percent: (
                      (value / course.gradeWCounts[gradeIndex]) *
                      100
                    ).toFixed(1),
                  }))}
                  margin={{
                    top: 15,
                    right: 0,
                    bottom: 15,
                    left: 0,
                  }}
                >
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 100]} />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <Tooltip />
                  <Bar dataKey="Percent" fill="#4DABF7" />
                </BarChart>
              </ResponsiveContainer>
              <Text ta="center">
                Average GPA: {course.averageGPA.toFixed(2) || "N/A"}
              </Text>
            </Container>
          ) : (
            <Text ta="center">No Grade Data Available</Text>
          )}
        </Grid.Col>
      </Grid>
    </Card>
  );
}
