class GlossaryRenderer {
    constructor() {
        this.data = {};
    }

    async loadData() {
        try {
            const [characters, glossary, locations] = await Promise.all([
                fetch('data/characters.json').then(r => r.json()),
                fetch('data/glossary.json').then(r => r.json()),
                fetch('data/locations.json').then(r => r.json())
            ]);
            
            this.data = { characters, glossary, locations };
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

    renderSection(sectionId, data, title) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Clear existing content except the h2
        const h2 = section.querySelector('h2');
        section.innerHTML = '';
        section.appendChild(h2);
        
        // Add entries
        data.forEach(entry => {
            section.appendChild(this.renderEntry(entry));
        });
    }

    async render() {
        await this.loadData();
        
        this.renderSection('characters', this.data.characters, 'MAJOR CHARACTERS');
        this.renderSection('glossary', this.data.glossary, 'GLOSSARY');
        this.renderSection('locations', this.data.locations, 'LOCATIONS');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const renderer = new GlossaryRenderer();
    await renderer.render();
    
    // Update navigation after content is loaded
    setTimeout(() => {
        if (typeof updateActiveNav === 'function') {
            updateActiveNav();
        }
    }, 100);
});