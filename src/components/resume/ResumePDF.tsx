import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { BaseResume } from "@/sanity/lib/types";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#333",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#111",
  },
  title: {
    fontSize: 14,
    color: "#0056b3",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 10,
    color: "#555",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 2,
    color: "#222",
  },
  itemRow: {
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: "#111",
  },
  itemSubtitle: {
    color: "#0056b3",
    fontSize: 11,
  },
  dateLocation: {
    fontSize: 10,
    color: "#666",
  },
  bulletList: {
    marginLeft: 10,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 5,
  },
  skillsRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  skillCategory: {
    width: 120,
    fontFamily: "Helvetica-Bold",
  },
  skillList: {
    flex: 1,
  },
  link: {
    color: "#0056b3",
    textDecoration: "none",
  }
});

interface ResumePDFProps {
  resume: BaseResume;
}

export const ResumePDF = ({ resume }: ResumePDFProps) => {
  const { identity, professionalSummary, skills, experience, projects, education } = resume;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{identity.fullName}</Text>
          <Text style={styles.title}>{identity.title}</Text>
          <View style={styles.contactRow}>
            {identity.email && <Text>{identity.email}</Text>}
            {identity.phone && <Text>• {identity.phone}</Text>}
            {identity.location && <Text>• {identity.location}</Text>}
            {identity.linkedin && <Link src={identity.linkedin} style={styles.link}>• LinkedIn</Link>}
            {identity.github && <Link src={identity.github} style={styles.link}>• GitHub</Link>}
          </View>
        </View>

        {/* Summary */}
        {professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.paragraph}>{professionalSummary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillsRow}>
                <Text style={styles.skillCategory}>{skill.categoryName}:</Text>
                <Text style={styles.skillList}>{skill.technologies.join(", ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.role}</Text>
                  <Text style={styles.dateLocation}>
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short'}) : ''} - 
                    {exp.isCurrent ? " Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short'}) : ''}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.companyName}</Text>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.responsibilities.map((resp, i) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{resp}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {projects.map((proj, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.title}</Text>
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    {proj.projectLink && <Link src={proj.projectLink} style={styles.link}>Link</Link>}
                    {proj.githubLink && <Link src={proj.githubLink} style={styles.link}>GitHub</Link>}
                  </View>
                </View>
                {proj.description && <Text style={styles.paragraph}>{proj.description}</Text>}
                {proj.techStack && proj.techStack.length > 0 && (
                  <Text style={styles.paragraph}>Technologies: {proj.techStack.join(", ")}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={styles.itemRow}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.institution}</Text>
                  <Text style={styles.dateLocation}>
                    {edu.startYear} - {edu.endYear || "Present"}
                  </Text>
                </View>
                <Text style={styles.paragraph}>
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
