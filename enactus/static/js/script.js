// Dummy Data for Team Members
const teamMembers = [
    { name: "Sarah Jenkins", role: "President", year: "2024", dept: "executive", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500" },
    { name: "Aryan Mehta", role: "Tech Head", year: "2024", dept: "tech", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500" },
    { name: "John Doe", role: "Marketing Lead", year: "2023", dept: "marketing", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500" },
    { name: "Emily Chen", role: "Research Head", year: "2024", dept: "research", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500" },
    { name: "Mike Ross", role: "Ex-President", year: "2022", dept: "executive", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500" },
    { name: "Priya Singh", role: "UI Designer", year: "2024", dept: "tech", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500" }
];

function renderTeam(members) {
    const container = document.getElementById('teamContainer');
    container.innerHTML = '';

    members.forEach(member => {
        const card = `
            <div class="member-card" data-aos="fade-in">
                <img src="${member.img}" alt="${member.name}" class="member-img">
                <h3 style="font-size: 1.5rem;">${member.name}</h3>
                <p style="color: var(--brand-yellow); font-weight: 600;">${member.role}</p>
                <p style="color: #888; font-size: 0.9rem;">${member.year} | ${member.dept.toUpperCase()}</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

function filterTeam() {
    const year = document.getElementById('yearFilter').value;
    const dept = document.getElementById('deptFilter').value;

    const filtered = teamMembers.filter(member => {
        const matchYear = year === "all" || member.year === year;
        const matchDept = dept === "all" || member.dept === dept;
        return matchYear && matchDept;
    });

    renderTeam(filtered);
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('teamContainer')) {
        renderTeam(teamMembers);
    }
});

/* --- EXISTING TEAM LOGIC GOES HERE (Keep your previous code) --- */

/* --- NEW EVENT ACCORDION LOGIC --- */
/* Keep previous team filtering code here... */

function toggleEvent(card) {
    // Check if the clicked card is already open
    const isOpen = card.classList.contains('active');

    // Close all cards first (Exclusive Accordion)
    document.querySelectorAll('.event-card').forEach(c => {
        c.classList.remove('active');
    });

    // If it wasn't open, open it now
    if (!isOpen) {
        card.classList.add('active');
    }
}

// Fade out flash messages after 4 seconds
setTimeout(() => {
    const flash = document.querySelector('.flash-messages');
    if(flash) {
        flash.style.transition = "opacity 1s ease";
        flash.style.opacity = 0;
        setTimeout(() => flash.remove(), 1000);
    }
}, 4000);