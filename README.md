# INVITO - Luxury Event Curation Platform

INVITO is an exclusive event curation web app that lets users create luxury party invitations, explore the platform's story, and apply for membership to gain access to private events around the world.

## What Does It Do?
- Cinematic landing page with animated INVITO CLUB branding
- Photo collage hero banner showcasing 7 party and nightlife images
- About Us section with the INVITO origin story, notable past events (La Nuit Dorée, The Obsidian Affair, Club de Humo), and platform stats
- Create exclusive events with name, date, time, venue, and description
- Personalized invitation cards — dark blue luxury design with gold ornamental borders, elegant typography, and event details
- Print or copy invitations to share with guests
- Party card grid displaying all created events with copy and delete actions
- First-party celebration modal congratulating the user
- Membership recruitment — benefits overview and sign-up form (name, email, phone, location) with a live registered-members display
- Tab navigation to switch between Events and Become a Member views
- Fully responsive design for desktop, tablet, and mobile

## How Do I Use It?
1. Open the [live site](https://pfernandezdecordova1.github.io/Invito/) and click "Step Inside" to enter
2. Browse the About Us story and platform stats
3. Click "+ Create Party" to open the event form
4. Fill in your event details and submit
5. View your personalized luxury invitation card — print it or copy the text to share
6. Navigate to "Become a Member" to sign up for private event access
7. Manage your events from the card grid (view invitation, copy details, delete)

## What Did I Learn?
- How to build a multi-view single-page app using vanilla JavaScript (toggling sections with classList and hidden states instead of separate HTML pages)
- How to use CSS Grid to create a responsive photo collage that adapts to different screen sizes
- How to design a luxury aesthetic entirely in CSS using gradients, pseudo-elements, ornamental borders, and layered backgrounds
- How to manage multiple independent state arrays (parties and members) and render them dynamically into the DOM
- How to use the Clipboard API (`navigator.clipboard.writeText`) to let users copy invitation text with one click
- How to structure a complex form-based workflow: form modal → state update → render invitation card → return to grid
- The importance of iterating on design — starting with a basic layout and progressively refining the branding, colors, typography, and responsiveness across multiple commits

## Live Demo
https://pfernandezdecordova1.github.io/Invito/

## Technologies
- HTML
- CSS (custom properties, CSS Grid, Flexbox, animations)
- Vanilla JavaScript (DOM manipulation, Clipboard API)
- Google Fonts (Playfair Display, Montserrat)
- Unsplash images