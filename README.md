# Connect & Create

Talab — UI/UX Design Specification frontend using react 

Design a complete modern web application called Talab, a Tunisia-first community platform where people post things they need and other users can help, recommend someone, or make an offer.

Product concept

Talab is NOT a traditional job board and NOT a Facebook clone.

The main concept is:

Ask for something. Find someone who can help.

Users can publish requests such as:

"I need a React developer for a small project."

"Looking for someone to design a logo."

"I need help understanding Java."

"Looking for a photographer in Tunis."

"Need someone to repair my laptop."

"Looking for a teammate for my PFE."

"Does anyone know a good English teacher?"

"Looking for someone to edit a video."

Every user can both ask for help and offer help.

The UI should feel like a combination of:

a modern community platform

a service marketplace

a discussion platform

a lightweight professional network

Do NOT copy Facebook, LinkedIn, Fiverr, or Reddit visually.

1. Design direction

Create a clean, modern, friendly and trustworthy interface.

The visual identity should feel:

youthful

professional

accessible

community-driven

trustworthy

modern

suitable for students, freelancers, professionals and ordinary users

Avoid an overly corporate appearance.

Use generous whitespace, rounded cards, subtle borders, soft shadows and clear typography.

The design should work beautifully on:

Desktop

Tablet

Mobile

Use a consistent responsive design system.

2. Color system

Create a professional primary color that represents trust and community.

Suggested direction:

Primary: deep blue / indigo

Secondary: turquoise or teal

Background: very light gray

Cards: white

Main text: dark charcoal

Secondary text: muted gray

Success: green

Warning: amber

Error: red

Do not make the interface excessively colorful.

Use color mainly for:

actions

status

categories

important information

3. Typography

Use a modern readable font such as:

Inter

Manrope

Plus Jakarta Sans

Use clear hierarchy:

Large page headings

Medium section headings

Comfortable body text

Small metadata

The interface must remain highly readable on mobile.

4. Main navigation

Desktop navigation:

Logo: Talab

Home
Explore
Categories
My Requests
My Offers

                    🔔 Notifications
                    💬 Messages
                    👤 Profile


Primary CTA:

+ Post a Request

The "Post a Request" button should always be visually prominent.

Mobile navigation:

Home
Explore
+ Post
Notifications
Profile


5. Landing page

Create a beautiful landing page for unauthenticated users.

Hero section:

Large headline:

Need something? Ask Talab.

Supporting text:

Connect with people who can help you, recommend someone, or offer their skills.

Primary CTA:

Post a Request

Secondary CTA:

Explore Requests

Hero should visually communicate people helping each other.

Below the hero:

Popular categories

Display attractive category cards:

💻 Technology
🎨 Design
📚 Education
🎓 Student & PFE
💼 Freelance
🔧 Services
📸 Photography
📝 Writing & Translation
🚗 Transport
🏠 Home
🛍️ Buying & Selling
💡 Recommendations

6. Home / Feed

This is the main authenticated page.

Desktop layout:

-----------------------------------------------------
Top navigation
-----------------------------------------------------

        Feed                     Right sidebar

[ + What do you need help with? ]     Categories

Request cards                         Trending

Request cards                         Popular users

Request cards


The feed should be the central focus.

At the top:

Create Request Card

Show:

What do you need?

Buttons/options:

Ask for help

Find a freelancer

Find a teammate

Ask for a recommendation

Primary button:

Post Request

7. Request card

Design a reusable request card.

Example:

┌─────────────────────────────────────────────┐
│ 👤 Sarah Ben Ali                2h ago      │
│                                             │
│ 🎨 DESIGN                                   │
│                                             │
│ I need a logo for my startup                │
│                                             │
│ I'm looking for a designer to create a      │
│ simple modern logo for a new project.       │
│                                             │
│ 💰 100 – 200 TND                            │
│ 📍 Tunis                                    │
│ 📅 Deadline: Sep 5                          │
│                                             │
│ 💬 12 comments      🟢 4 offers             │
│                                             │
│ [View Request]                              │
└─────────────────────────────────────────────┘


Include:

Author

Avatar

Time

Category

Title

Description preview

Budget

Location

Deadline

Number of comments

Number of offers

Status

Status examples:

🟢 Open
🟡 In progress
🔵 Completed
🔴 Cancelled

8