export interface ConceptDebrief {
  problem: string;
  solution: string;
  approach: string;
}

export interface EmptyStateDebrief {
  headline: string;
  body: string;
  closingLine: string;
  ctaLabel: string;
  ctaHref?: string;
}

export interface IdeaItem {
  id: string;
  num: string;
  accentVar: string;
  accentColor: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  label: string;
  name?: string;
  category?: string;
  status?: string;
  headline: string;
  description: string;
  supportingCopy?: string;
  supportingStatement?: string;
  interactionCue: string;
  domain: string;
  footerHint?: string;
  isOpenSlot?: boolean;
  emptyState?: EmptyStateDebrief;
  debrief?: ConceptDebrief;
}

export const IDEATION_ITEMS: IdeaItem[] = [
  {
    id: "idea-01",
    num: "01",
    accentVar: "lavender",
    accentColor: "var(--accent-lavender)",
    image: "/images/project-community.png",
    imageAlt: "Project Community - Hyperlocal digital layer connecting people, places and communities in your city",
    imagePosition: "center 30%",
    label: "IDEA_01 / PROJECT COMMUNITY",
    name: "Project Community",
    category: "Hyperlocal Social / Community / AI Experiences",
    status: "Speculative concept / Experimental exploration",
    headline: "WHAT IF YOUR CITY FELT LIKE A COMMUNITY AGAIN?",
    description:
      "A hyperlocal digital layer connecting people, places and the communities around them.",
    supportingStatement:
      "The internet connects us globally. What if it could help us connect more meaningfully with the people and places around us?",
    interactionCue: "EXPLORE THE POSSIBILITY ↗",
    domain: "HYPERLOCAL SOCIAL // AI EXPERIENCES",
    debrief: {
      problem: `Digital platforms make it easy to consume content and communicate across distances, yet discovering and participating in the communities immediately around us can still feel fragmented.

Local places, people and shared interests often lack a cohesive digital layer that brings them together. Conventional social feeds are not necessarily designed around local context, while a map alone cannot provide a complete social experience.

Project Community explores the opportunity to make local discovery and community participation feel more connected, contextual and engaging.`,
      solution: `Project Community is an experimental, hyperlocal, community-driven digital platform envisioned primarily around Gen Z social interaction.

Imagine a digital layer over the world around you: a place to explore local surroundings, discover community activity, establish a digital identity and participate in location-aware social experiences.

The concept explores:
- Hyperlocal discovery and map-centered experiences.
- Social interaction shaped by places and communities.
- Digital identity and a sense of local presence.
- Gamification to make participation and discovery more engaging.
- AI-powered experiences that could make community interactions more useful and interactive.

The map is an interface to the experience, not the entire product. The bigger ambition is to explore how digital identity, place, social interaction and participation could work together as a cohesive community platform.`,
      approach: `SOEZE could explore this concept through a modern web application, a location-aware interface and modular social experiences designed around actual community needs.

Potential areas of exploration include:
- A responsive, map-centered interface using an appropriate mapping solution.
- Hyperlocal discovery and contextual community experiences.
- Digital identity and social interaction patterns.
- Gamification mechanics that reward meaningful participation rather than empty engagement.
- Carefully scoped AI-powered features where they genuinely improve the experience.
- A modular frontend and backend architecture that can evolve as the concept is validated.

The approach should be iterative: establish the core user problem, prototype the experience, validate the assumptions and then determine which features deserve to be built.`,
    },
  },
  {
    id: "idea-02",
    num: "02",
    accentVar: "mint",
    accentColor: "var(--accent-mint)",
    image: "/images/ephemia.png",
    imageAlt: "Ephemia - Reusable notebook bridging handwriting with digital note-taking and NFC/QR sync",
    imagePosition: "center center",
    label: "IDEA_02 / EPHEMIA",
    name: "Ephemia",
    category: "PRODUCT DESIGN / NFC / SUSTAINABILITY",
    status: "Speculative concept / Product exploration",
    headline: "WHAT IF YOUR NOTES NEVER REALLY ENDED?",
    description:
      "A reusable notebook that bridges the feeling of writing on paper with the convenience of digital note-taking.",
    supportingStatement: "Write once. Keep forever.",
    interactionCue: "EXPLORE THE POSSIBILITY ↗",
    domain: "PRODUCT DESIGN // NFC & SUSTAINABILITY",
    debrief: {
      problem: `Traditional notebooks offer a satisfying, flexible writing experience, but their pages eventually fill up, and keeping handwritten notes organised, searchable and accessible across devices can be inconvenient.

Digital note-taking solves some of these problems, yet it can lose the tactile simplicity and freedom of putting pen to paper.

Ephemia explores a more thoughtful alternative: a reusable physical notebook that retains the experience of handwriting while making it easier to carry important notes into the digital world.

The opportunity is to combine everyday stationery with purposeful technology and sustainable product design.`,
      solution: `Ephemia is a smart, reusable notebook brand designed to connect physical writing with digital convenience.

The concept centres on reusable pages that can be written on, erased and used again. NFC-enabled interactions and QR scanning are explored as ways to help users digitise handwritten notes, save them and access them digitally.

The product vision includes:
- Reusable writing pages that reduce the need for repeatedly replacing notebooks.
- NFC and QR-enabled interactions connecting the physical notebook to digital note capture and storage.
- A family of A4, A5 and A6 notebook formats.
- Base, Mid and Premium product tiers.
- Thermo-sensitive pen options explored for Mid and Premium variants.
- Refillable writing tools and replacement page options.
- Personalised covers and page layouts.
- Tree-free or recycled paper options, minimal eco-conscious packaging and sustainability-led product decisions.

Ephemia is intended for students, artists, designers, creative professionals and business users who value handwriting but also want a more connected workflow.

Brand line: "Write Once. Keep Forever."

Additional brand messaging previously explored: "Your Notes, Limitless & Digital!" and "Smart Notes. Greener Future."

Treat NFC, QR scanning, page materials and writing/erasing methods as product design intentions that require appropriate prototyping and validation. Do not claim that a complete working product already exists.`,
      approach: `SOEZE could approach Ephemia as a product design and digital experience project, combining physical product development with a complementary digital interface.

Potential exploration stages:
1. Develop the notebook's visual identity, product family and industrial design direction.
2. Prototype reusable page materials and validate the actual writing and erasing experience.
3. Explore NFC tags and QR codes as reliable bridges between physical notes and digital workflows.
4. Design a mobile-friendly note capture and organisation experience, subject to the chosen technical implementation.
5. Explore refill systems, customisable layouts and sustainable packaging.
6. Validate usability, durability, material choices and product economics before committing to manufacturing.

The objective is not to add technology for its own sake. It is to make writing feel natural, make notes easier to preserve and reuse, and create a product that encourages more thoughtful consumption.`,
    },
  },
  {
    id: "idea-03",
    num: "03",
    accentVar: "lime",
    accentColor: "var(--accent-lime, var(--accent-yellow))",
    image: "/images/open-idea.png",
    imageAlt: "Open Idea - Your idea could live here, an open invitation for ideas and collaboration",
    imagePosition: "center center",
    label: "IDEA_03 / YOUR TURN",
    name: "Open Slot",
    category: "OPEN SLOT / UNDEFINED",
    status: "Open invitation / Unwritten space",
    headline: "WE HAVEN'T FIGURED THIS ONE OUT. YET.",
    description: "And we're okay with that. Not every idea starts with us.",
    supportingCopy:
      "This space is intentionally empty, waiting for a question we haven't asked or a possibility we haven't imagined.",
    interactionCue: "YOUR IDEA COULD LIVE HERE ↗",
    domain: "OPEN SLOT // UNDEFINED",
    footerHint: "NO CONCEPT. NO PRETENDING.",
    isOpenSlot: true,
    emptyState: {
      headline: "YOUR IDEA COULD LIVE HERE.",
      body: `We could fill this space with another concept just to make the collection look complete. But that wouldn't be honest.

So we're leaving it open.

Maybe you've noticed a problem nobody seems to care about solving. Maybe you've imagined something that doesn't exist yet. Or maybe this empty space is exactly where your next idea begins.

We don't have the answer for Idea 03. That's the point.

What would you put here?`,
      closingLine: "THE NEXT IDEA COULD BE YOURS.",
      ctaLabel: "LET'S TALK ABOUT YOUR IDEA ↗",
      ctaHref: "#contact",
    },
  },
];
