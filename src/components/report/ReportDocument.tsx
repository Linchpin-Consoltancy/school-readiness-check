import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import {
  DISCLAIMER,
  FINDINGS_HEADING,
  GAP_DESCRIPTORS,
  GAP_NOTE,
  GAP_NOTE_HEADING,
  HOW_TO_READ,
  HOW_TO_READ_HEADING,
  LENS_REPORT_LABELS,
  NEXT_STEPS,
  NEXT_STEPS_HEADING,
  PATTERNS_HEADING,
  PATTERN_VARIANTS,
  REPORT_TITLE,
  SUMMARY_HEADING,
  isPlaceholder,
} from "@/content/report";
import { domainName, fillTokens, lensList, type VariantChoice } from "@/lib/report";
import { formatScore, type DomainResult } from "@/lib/scoring";

/* Brand palette. The page itself is Ivory rather than Parchment so that a
   printed copy does not lay down a full page of ink. Parchment is kept for
   the panels, where it earns its warmth. */
const COLOR = {
  onyx: "#1B3040",
  amber: "#C07B2A",
  dusk: "#5A7280",
  parchment: "#F5EFE6",
  ivory: "#FDFBF8",
  charcoal: "#1A1A1A",
  hairline: "#D9D0C4",
  placeholder: "#A99A86",
};

/** Absolutely positioned items are measured from the page edge, not from the
 *  text column, so the margin is named once and reused by the footer. */
const PAGE_MARGIN = 56;

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLOR.ivory,
    paddingTop: 52,
    paddingBottom: 72,
    paddingHorizontal: PAGE_MARGIN,
    fontFamily: "Jost",
    fontSize: 9.5,
    color: COLOR.charcoal,
    lineHeight: 1.6,
  },

  /* --- brandmark ---------------------------------------------------- */
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandWords: { flexDirection: "row", alignItems: "flex-end" },
  brandDiamond: {
    width: 6,
    height: 6,
    backgroundColor: COLOR.amber,
    transform: "rotate(45deg)",
    marginRight: 9,
  },
  brandName: {
    fontFamily: "Cormorant Garamond",
    fontSize: 15,
    lineHeight: 1,
    color: COLOR.onyx,
    marginRight: 7,
  },
  brandSuffix: {
    fontSize: 6,
    lineHeight: 1,
    letterSpacing: 2.2,
    color: COLOR.dusk,
    textTransform: "uppercase",
    marginBottom: 2.5,
  },
  brandRule: {
    height: 1,
    backgroundColor: COLOR.amber,
    marginTop: 12,
    width: 42,
  },

  /* --- section furniture -------------------------------------------- */
  sectionRule: { height: 1, backgroundColor: COLOR.hairline },
  sectionIndex: {
    fontSize: 6.5,
    letterSpacing: 2,
    color: COLOR.amber,
    textTransform: "uppercase",
    marginTop: 14,
  },
  sectionTitle: {
    fontFamily: "Cormorant Garamond",
    fontSize: 19,
    color: COLOR.onyx,
    marginTop: 6,
  },

  eyebrow: {
    fontSize: 6.5,
    letterSpacing: 2.2,
    color: COLOR.amber,
    textTransform: "uppercase",
  },
  label: {
    fontSize: 6.5,
    letterSpacing: 1.6,
    color: COLOR.dusk,
    textTransform: "uppercase",
  },
  body: { fontSize: 9.5, lineHeight: 1.65, color: COLOR.charcoal },
  placeholder: {
    fontSize: 9.5,
    lineHeight: 1.65,
    color: COLOR.placeholder,
  },

  /* --- section 1 ----------------------------------------------------- */
  schoolName: {
    fontFamily: "Cormorant Garamond",
    fontSize: 30,
    color: COLOR.onyx,
    lineHeight: 1.15,
  },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 26 },
  metaCell: { width: "50%", marginBottom: 16, paddingRight: 12 },
  metaValue: { fontSize: 10, color: COLOR.charcoal, marginTop: 4 },

  disclaimer: {
    backgroundColor: COLOR.parchment,
    borderLeftWidth: 2,
    borderLeftColor: COLOR.amber,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginTop: 12,
  },
  disclaimerText: { fontSize: 8.5, lineHeight: 1.55, color: COLOR.dusk },

  /* --- section 3 table ----------------------------------------------- */
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.onyx,
    paddingBottom: 7,
    marginTop: 22,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLOR.hairline,
    paddingVertical: 11,
  },
  colBar: { width: 3, height: 26, marginRight: 13 },
  colDomain: { flex: 1, paddingRight: 10 },
  colScore: { width: 52, textAlign: "right", paddingRight: 16 },
  colTier: { width: 118 },
  domainCell: {
    fontFamily: "Cormorant Garamond",
    fontSize: 13.5,
    lineHeight: 1.25,
    color: COLOR.onyx,
  },
  scoreCell: {
    fontFamily: "Cormorant Garamond",
    fontSize: 16,
    lineHeight: 1.25,
    color: COLOR.onyx,
    textAlign: "right",
  },
  tierCell: { fontSize: 7, letterSpacing: 1.1, textTransform: "uppercase" },

  /* --- section 4 blocks ----------------------------------------------- */
  finding: {
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR.hairline,
  },
  findingHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  findingName: {
    fontFamily: "Cormorant Garamond",
    fontSize: 17,
    lineHeight: 1.2,
    color: COLOR.onyx,
    flex: 1,
    paddingRight: 14,
  },
  findingScore: {
    fontFamily: "Cormorant Garamond",
    fontSize: 22,
    lineHeight: 1.2,
    color: COLOR.onyx,
    textAlign: "right",
  },
  tierRow: { flexDirection: "row", alignItems: "center", marginTop: 9 },
  tierDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 6 },
  lensStrip: {
    backgroundColor: COLOR.parchment,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  lensText: { fontSize: 8.5, letterSpacing: 0.5, color: COLOR.onyx },

  gapNote: {
    borderLeftWidth: 2,
    borderLeftColor: COLOR.amber,
    paddingLeft: 12,
    paddingVertical: 3,
    marginTop: 12,
  },
  gapHeading: {
    fontSize: 6.5,
    letterSpacing: 1.6,
    color: COLOR.amber,
    textTransform: "uppercase",
    marginBottom: 5,
  },

  /* --- section 6 ------------------------------------------------------- */
  step: { flexDirection: "row", marginTop: 20 },
  stepNumber: {
    fontFamily: "Cormorant Garamond",
    fontSize: 21,
    lineHeight: 1,
    color: COLOR.amber,
    width: 30,
  },
  stepTitle: {
    fontSize: 7,
    letterSpacing: 1.6,
    color: COLOR.onyx,
    textTransform: "uppercase",
    marginBottom: 7,
  },

  /* --- footer ----------------------------------------------------------
     Each piece is positioned and marked fixed on its own. A wrapper View
     around them is not carried onto later pages by the renderer. */
  footerRule: {
    position: "absolute",
    bottom: 46,
    left: PAGE_MARGIN,
    right: PAGE_MARGIN,
    height: 1,
    backgroundColor: COLOR.hairline,
  },
  footerLeft: {
    position: "absolute",
    bottom: 30,
    left: PAGE_MARGIN,
    fontSize: 6.5,
    letterSpacing: 1.2,
    color: COLOR.dusk,
  },
  footerRight: {
    position: "absolute",
    bottom: 30,
    right: PAGE_MARGIN,
    width: 150,
    fontSize: 6.5,
    letterSpacing: 1.2,
    color: COLOR.dusk,
    textAlign: "right",
    textTransform: "uppercase",
  },
});

export type ReportData = {
  schoolName: string;
  principalName: string;
  schoolType: string;
  enrolment: string;
  region: string | null;
  assessmentDate: string;
  /** Already sorted with the highest priority first. */
  results: DomainResult[];
  variant: VariantChoice;
  lowestDomainName: string;
};

function Brandmark() {
  return (
    <View>
      <View style={styles.brandRow}>
        <View style={styles.brandDiamond} />
        <View style={styles.brandWords}>
          <Text style={styles.brandName}>Linchpin</Text>
          <Text style={styles.brandSuffix}>Education</Text>
        </View>
      </View>
    </View>
  );
}

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <View>
      <View style={styles.sectionRule} />
      <Text style={styles.sectionIndex}>Section {index}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

/** Renders a paragraph, greyed out when the text has not been written yet. */
function Copy({ text, style }: { text: string; style?: Style }) {
  return (
    <Text style={[isPlaceholder(text) ? styles.placeholder : styles.body, style]}>
      {text}
    </Text>
  );
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaCell}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function Footer({ schoolName }: { schoolName: string }) {
  return (
    <>
      <View style={styles.footerRule} fixed />
      <Text style={styles.footerLeft} fixed>
        {schoolName.toUpperCase()}
      </Text>
    </>
  );
}

/** The right hand footer mark.
 *
 *  This would carry "Page 2 of 5", but page numbers can only be reached
 *  through the renderer's render prop, which produces no output in this
 *  release (verified on 4.8.1 and 4.9.0, in and out of absolute
 *  positioning). A static mark is used until that is fixed upstream. */
function FooterMark() {
  return (
    <Text style={styles.footerRight} fixed>
      Linchpin Education
    </Text>
  );
}

function FindingBlock({ result }: { result: DomainResult }) {
  if (!result.tier || result.displayScore === null) return null;

  const tier = result.tier;
  const descriptor =
    GAP_DESCRIPTORS[result.domainId]?.[tier.id] ??
    "[To be supplied: gap descriptor.]";

  const lensLine = result.lenses
    .map(
      (lens) =>
        `${LENS_REPORT_LABELS[lens.lensId]}: ${
          lens.score === null ? "-" : formatScore(lens.score)
        }`,
    )
    .join("   |   ");

  return (
    <View style={styles.finding} wrap={false}>
      <View style={styles.findingHead}>
        <Text style={styles.findingName}>{domainName(result.domainId)}</Text>
        <Text style={styles.findingScore}>
          {formatScore(result.displayScore)}
        </Text>
      </View>

      <View style={styles.tierRow}>
        <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
        <Text style={[styles.tierCell, { color: tier.color }]}>
          {tier.label}
        </Text>
      </View>

      <View style={styles.lensStrip}>
        <Text style={styles.lensText}>{lensLine}</Text>
      </View>

      <Copy text={descriptor} style={{ marginTop: 12 }} />

      {result.gapFlag ? (
        <View style={styles.gapNote}>
          <Text style={styles.gapHeading}>{GAP_NOTE_HEADING}</Text>
          <Copy
            text={fillTokens(GAP_NOTE, {
              LENSES: lensList(result.gapLenses),
              LENS_WORD: result.gapLenses.length === 1 ? "view" : "views",
              VERB: result.gapLenses.length === 1 ? "differs" : "differ",
            })}
          />
        </View>
      ) : null}
    </View>
  );
}

export function ReportDocument({ data }: { data: ReportData }) {
  const variantParagraphs = PATTERN_VARIANTS[data.variant.id];

  return (
    <Document
      title={`Linchpin School Systems Self-Assessment, ${data.schoolName}`}
      author="Linchpin Education"
      subject={REPORT_TITLE}
      creator="Linchpin Education"
      producer="Linchpin Education"
    >
      {/* ---------- Page 1: profile and how to read ---------- */}
      <Page size="A4" style={styles.page}>
        <Footer schoolName={data.schoolName} />
        <FooterMark />

        <Brandmark />
        <View style={styles.brandRule} />

        <View style={{ marginTop: 40 }}>
          <Text style={styles.eyebrow}>{REPORT_TITLE}</Text>
          <Text style={[styles.schoolName, { marginTop: 12 }]}>
            {data.schoolName}
          </Text>
        </View>

        <View style={styles.metaGrid}>
          <MetaCell label="Principal" value={data.principalName} />
          <MetaCell label="Assessment date" value={data.assessmentDate} />
          <MetaCell label="School type" value={data.schoolType} />
          <MetaCell label="Approximate enrolment" value={data.enrolment} />
          {data.region ? (
            <MetaCell label="County or region" value={data.region} />
          ) : null}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
        </View>

        <View style={{ marginTop: 40 }}>
          <SectionHeading index="Two" title={HOW_TO_READ_HEADING} />
          {HOW_TO_READ.map((paragraph, index) => (
            <Copy
              key={index}
              text={paragraph}
              style={{ marginTop: index === 0 ? 16 : 12 }}
            />
          ))}
        </View>
      </Page>

      {/* ---------- Page 2: summary table and findings ---------- */}
      <Page size="A4" style={styles.page}>
        <Footer schoolName={data.schoolName} />
        <FooterMark />

        <SectionHeading index="Three" title={SUMMARY_HEADING} />

        <View style={styles.tableHead}>
          <View style={{ width: 16 }} />
          <Text style={[styles.label, styles.colDomain]}>Domain</Text>
          <Text style={[styles.label, styles.colScore]}>Score</Text>
          <Text style={[styles.label, styles.colTier]}>Priority tier</Text>
        </View>

        {data.results.map((result) => (
          <View key={result.domainId} style={styles.tableRow} wrap={false}>
            <View
              style={[
                styles.colBar,
                { backgroundColor: result.tier?.color ?? COLOR.dusk },
              ]}
            />
            <Text style={[styles.domainCell, styles.colDomain]}>
              {domainName(result.domainId)}
            </Text>
            <Text style={[styles.scoreCell, styles.colScore]}>
              {result.displayScore === null
                ? "-"
                : formatScore(result.displayScore)}
            </Text>
            <Text
              style={[
                styles.tierCell,
                styles.colTier,
                { color: result.tier?.color ?? COLOR.dusk },
              ]}
            >
              {result.tier?.label ?? "Not scored"}
            </Text>
          </View>
        ))}

        {/* Started on its own page so the heading is never left stranded at
            the foot of the summary table. */}
        <View break>
          <SectionHeading index="Four" title={FINDINGS_HEADING} />
        </View>

        {data.results.map((result) => (
          <FindingBlock key={result.domainId} result={result} />
        ))}
      </Page>

      {/* ---------- Final page: patterns and next steps ---------- */}
      <Page size="A4" style={styles.page}>
        <Footer schoolName={data.schoolName} />
        <FooterMark />

        <SectionHeading index="Five" title={PATTERNS_HEADING} />
        {variantParagraphs.map((paragraph, index) => (
          <Copy
            key={index}
            text={paragraph}
            style={{ marginTop: index === 0 ? 16 : 12 }}
          />
        ))}

        <View style={{ marginTop: 44 }}>
          <SectionHeading index="Six" title={NEXT_STEPS_HEADING} />
        </View>

        {NEXT_STEPS.map((step, index) => (
          <View key={step.title} style={styles.step} wrap={false}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              {step.paragraphs.map((paragraph, paragraphIndex) => (
                <Copy
                  key={paragraphIndex}
                  text={fillTokens(paragraph, {
                    DOMAIN: data.lowestDomainName,
                  })}
                  style={{ marginTop: paragraphIndex === 0 ? 0 : 10 }}
                />
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
