// Test script to force tablet styles
console.log('Testing tablet styles...');

// Force add tablet-landscape class
document.body.classList.add('tablet-landscape');
console.log('Added tablet-landscape class to body');

// Check if class was added
console.log('Body classes:', document.body.className);

// Find team elements and log their computed styles
const teamImages = document.querySelectorAll('.team-image-new');
const teamContainers = document.querySelectorAll('.team-photo-container-new');
const founderImage = document.querySelector('.founder-height-responsive');
const founderContainer = document.querySelector('.founder-photo-container-new');
const teamLayout = document.querySelector('.desktop-team-layout');
const teamGrid = document.querySelector('.desktop-team-grid');

console.log('Found elements:');
console.log('Team images:', teamImages.length);
console.log('Team containers:', teamContainers.length);
console.log('Founder image:', founderImage ? 'found' : 'not found');
console.log('Founder container:', founderContainer ? 'found' : 'not found');
console.log('Team layout:', teamLayout ? 'found' : 'not found');
console.log('Team grid:', teamGrid ? 'found' : 'not found');

// Log computed styles
if (teamImages.length > 0) {
    const firstTeamImage = teamImages[0];
    const computedStyle = window.getComputedStyle(firstTeamImage);
    console.log('First team image computed styles:');
    console.log('Width:', computedStyle.width);
    console.log('Height:', computedStyle.height);
}

if (teamContainers.length > 0) {
    const firstContainer = teamContainers[0];
    const computedStyle = window.getComputedStyle(firstContainer);
    console.log('First team container computed styles:');
    console.log('Width:', computedStyle.width);
    console.log('Height:', computedStyle.height);
}

if (founderImage) {
    const computedStyle = window.getComputedStyle(founderImage);
    console.log('Founder image computed styles:');
    console.log('Height:', computedStyle.height);
}

if (teamLayout) {
    const computedStyle = window.getComputedStyle(teamLayout);
    console.log('Team layout computed styles:');
    console.log('Gap:', computedStyle.gap);
    console.log('Max-width:', computedStyle.maxWidth);
}

if (teamGrid) {
    const computedStyle = window.getComputedStyle(teamGrid);
    console.log('Team grid computed styles:');
    console.log('Column gap:', computedStyle.columnGap);
    console.log('Row gap:', computedStyle.rowGap);
    console.log('Max-width:', computedStyle.maxWidth);
}

// Force styles directly via JavaScript as a test - MUCH LARGER SIZES (1.7x) + LEFT SHIFT
console.log('Forcing styles directly with MUCH LARGER sizes (1.7x) and LEFT SHIFT...');

teamImages.forEach((img, index) => {
    img.style.width = '238px'; // 1.7x increase from 140px
    img.style.height = '238px';
    console.log(`Set team image ${index} to 238x238px (1.7x larger)`);
});

teamContainers.forEach((container, index) => {
    container.style.width = '238px';
    container.style.height = '238px';
    container.style.minHeight = '238px';
    console.log(`Set team container ${index} to 238x238px (1.7x larger)`);
});

if (founderImage) {
    founderImage.style.height = '510px'; // 1.7x increase from 300px
    console.log('Set founder image height to 510px (1.7x larger)');
}

if (founderContainer) {
    founderContainer.style.height = '510px';
    console.log('Set founder container height to 510px (1.7x larger)');
}

if (teamLayout) {
    teamLayout.style.gap = '2.5rem';
    teamLayout.style.maxWidth = '1000px'; // Much wider
    teamLayout.style.paddingLeft = '0.5rem';
    teamLayout.style.paddingRight = '3rem'; // More right padding to shift left
    teamLayout.style.margin = '0';
    teamLayout.style.marginLeft = '-2rem'; // Shift entire layout left
    teamLayout.style.justifyContent = 'flex-start'; // Align to left
    console.log('Set team layout styles - MUCH LARGER + LEFT SHIFT');
}

if (teamGrid) {
    teamGrid.style.columnGap = '2rem'; // Increased gaps
    teamGrid.style.rowGap = '1.8rem';
    teamGrid.style.maxWidth = '650px'; // Much wider for larger photos
    teamGrid.style.marginLeft = '0.5rem'; // Slight left shift
    teamGrid.style.marginRight = '0';
    console.log('Set team grid styles - MUCH LARGER + LEFT SHIFT');
}

// Make section take even more height and shift left
const section = document.querySelector('section.py-20.px-4.sm\\:px-6.lg\\:px-8.bg-gradient-to-br.from-white.to-gray-50');
if (section) {
    section.style.minHeight = '120vh'; // Even taller
    section.style.display = 'flex';
    section.style.flexDirection = 'column';
    section.style.justifyContent = 'center';
    section.style.paddingTop = '1rem';
    section.style.paddingBottom = '1rem';
    console.log('Set section to even taller height (120vh)');
}

// Make team member names smaller
const teamMemberNames = document.querySelectorAll('.desktop-team-member h3');
teamMemberNames.forEach((name, index) => {
    name.style.fontSize = '0.875rem'; // Smaller team member names
    name.style.lineHeight = '1.1';
    console.log(`Set team member name ${index} to smaller size`);
});

// Make founder name smaller
const founderName = document.querySelector('.desktop-team-layout > .flex-shrink-0 h3');
if (founderName) {
    founderName.style.fontSize = '1.125rem'; // Smaller founder name
    founderName.style.lineHeight = '1.1';
    console.log('Set founder name to smaller size');
}

console.log('Style forcing complete!');
