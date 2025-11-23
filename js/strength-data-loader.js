class WorldGlossaryRenderer {
    constructor(bookFolder) {
        this.data = {};
        this.bookFolder = bookFolder || 'strength-of-the-few';
    }

    async loadData() {
        try {
            const basePath = `data/${this.bookFolder}`;
            const [res, luceum, obiteum] = await Promise.all([
                fetch(`${basePath}/res.json`).then(r => r.json()),
                fetch(`${basePath}/luceum.json`).then(r => r.json()),
                fetch(`${basePath}/obiteum.json`).then(r => r.json())
            ]);

            this.data = { res, luceum, obiteum };
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    renderEntry(entry) {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry';

        let html = `<span class="term">${entry.term}</span>`;

        if (entry.pronunciation) {
            html += ` <span class="pronunciation">(${entry.pronunciation})</span>`;
        }

        if (entry.title) {
            html += `, <span class="term">${entry.title}</span>`;
        }

        if (entry.altTerm) {
            html += ` / <span class="term">${entry.altTerm}</span>`;
            if (entry.altPronunciation) {
                html += ` <span class="pronunciation">(${entry.altPronunciation})</span>`;
            }
        }

        html += ` – <span class="definition">${entry.definition}</span>`;

        entryDiv.innerHTML = html;
        return entryDiv;
    }

    renderSection(sectionId, data) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Clear existing content except the h3
        const h3 = section.querySelector('h3');
        section.innerHTML = '';
        if (h3) {
            section.appendChild(h3);
        }

        // Add entries
        data.forEach(entry => {
            section.appendChild(this.renderEntry(entry));
        });
    }

    async render() {
        await this.loadData();

        // Render Characters sections
        this.renderSection('characters-res', this.data.res.characters);
        this.renderSection('characters-luceum', this.data.luceum.characters);
        this.renderSection('characters-obiteum', this.data.obiteum.characters);

        // Render Glossary sections
        this.renderSection('glossary-res', this.data.res.glossary);
        this.renderSection('glossary-luceum', this.data.luceum.glossary);
        this.renderSection('glossary-obiteum', this.data.obiteum.glossary);

        // Render Locations sections
        this.renderSection('locations-res', this.data.res.locations);
        this.renderSection('locations-luceum', this.data.luceum.locations);
        this.renderSection('locations-obiteum', this.data.obiteum.locations);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const bookFolder = window.BOOK_FOLDER || 'strength-of-the-few';
    const renderer = new WorldGlossaryRenderer(bookFolder);
    await renderer.render();

    // Update navigation after content is loaded
    setTimeout(() => {
        if (typeof updateActiveNav === 'function') {
            updateActiveNav();
        }
    }, 100);
});
