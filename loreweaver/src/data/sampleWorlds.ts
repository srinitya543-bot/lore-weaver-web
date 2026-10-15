import { LoreWorld } from '../types/lore';

export const SAMPLE_WORLDS: LoreWorld[] = [
  {
    id: 'aethelgard',
    name: 'Aethelgard: The Shardfall Chronicles',
    genre: 'Epic Dark Fantasy & Eldritch Mystery',
    tagline: 'A shattered empire bound by cold lunar quartz and blood covenants.',
    description: 'When the twin moons fractured four centuries ago, luminous crystal shards rained across Aethelgard. The resulting resonance gave birth to Silverflame witchcraft, sovereign city-spires, and centuries of clandestine warfare.',
    eras: ['The Shardfall (Year 0-50)', 'The Silent Accord (Year 51-240)', 'The Current War of Spires (Year 241+)'],
    documents: [
      {
        id: 'doc-magic-01',
        title: 'Codex Argentum: The Laws of Silverflame Resonance',
        category: 'Magic Laws',
        canonStatus: 'immutable_canon',
        tags: ['magic_laws', 'silverflame', 'resonance', 'limitations'],
        content: `LAW I: NOCTURNAL REFRACTION
Silverflame is not ordinary combustion; it is celestial kinetic luminescence. It CANNOT be ignited under the direct rays of the sun (Sol-Prime). To cast during daytime, an acolyte must possess a polished Moonstone Prism or conduct the flame within absolute pitch-dark subterranean catacombs.

LAW II: THE CARNAL COST
Every invocation drains the caster's bodily calcium and marrow heat. Repeated daytime coercion without a focus results in spontaneous calcification of the lungs.

LAW III: THE COLD SEAL
Silverflame cannot burn silver-forged iron or mirrorglass. Mirrors bend and refract its trajectory, returning the kinetic shockwave to the summoner.`,
        wordCount: 145,
        dateModified: 'Year 242 AF'
      },
      {
        id: 'doc-char-varik',
        title: 'Dossier: Lord Regent Varik of House Thorne',
        category: 'Character Dossiers',
        canonStatus: 'immutable_canon',
        tags: ['character', 'varik', 'house_thorne', 'sunken_spire'],
        content: `BIOGRAPHY & PHYSIOLOGY:
Lord Varik Thorne currently serves as Iron Regent of the Sunken Spire.
During the Cataclysmic Siege of Mor-Dun (Year 238 AF), an eldritch flash powder detonated before his dais, rendering him completely and irreversibly blind. He wears a heavy veil of spun lead laced with runic obsidian.
He perceives physical reality purely through vibrational echo and the heat signatures of moonstone.

ALLEGIANCE & FLAWS:
- House Thorne Commander. Bitter enemy of Grand Archivist Vael.
- Trait: Relentlessly paranoid. Refuses to enter any room with reflective mirrors.
- Oath: Swore never to let the Obsidian Heart fall into the hands of the Silver Inquisition.`,
        wordCount: 130,
        dateModified: 'Year 243 AF'
      },
      {
        id: 'doc-char-morg',
        title: 'Inquisitor High Marshall Morgana of the Silver Inquisition',
        category: 'Character Dossiers',
        canonStatus: 'immutable_canon',
        tags: ['character', 'morgana', 'inquisition', 'zealot'],
        content: `SUMMARY:
Supreme Magistrate of the Silver Inquisition. Fanatical devotion to the celestial purity of the fractured moons.
Known for executing the apostates of the Ashen Conclave.
Wields the 'Gavel of Dawn', an adamantine warhammer inset with three cold moonstone cores.
Under her orders, any illicit trade of raw moonstone ore carries the penalty of public exsanguination.`,
        wordCount: 78,
        dateModified: 'Year 244 AF'
      },
      {
        id: 'doc-faction-01',
        title: 'The Sunken Spire vs The Silver Inquisition',
        category: 'Geography & Kingdoms',
        canonStatus: 'immutable_canon',
        tags: ['factions', 'war', 'territory', 'treaties'],
        content: `GEOGRAPHICAL SEPARATION:
The Sunken Spire is situated in the flooded salt marshes of the Lower Weald, exactly 400 leagues southwest of the Cathedral of Dawn (the Inquisition's capital).
Travel between the two seats requires a minimum of eight days by armored river barge or four days by wind-drake couriers.
Under the Treaty of Salt (Year 210 AF), no armed Inquisitor may cross the Greybridge without written dispensation from the Regent.`,
        wordCount: 88,
        dateModified: 'Year 240 AF'
      },
      {
        id: 'doc-history-01',
        title: 'Chronicle of the Fallen: The Fate of Commander Brandon Vane',
        category: 'Historical Chronicles',
        canonStatus: 'immutable_canon',
        tags: ['history', 'deaths', 'canon_events', 'vane'],
        content: `RECORD OF DEATH:
Commander Brandon Vane of the 4th Vigil was conclusively slain and cremated during the Night of Red Banners (Year 241 AF) at the Gates of Mor-Dun.
His skull is entombed in the Crypt of Iron Martyrs.
Any claim of his physical survival is classified as heresy or illusory glamour perpetuated by the Guild of Whispers.`,
        wordCount: 70,
        dateModified: 'Year 241 AF'
      }
    ],
    entities: [
      {
        id: 'ent-varik',
        name: 'Lord Regent Varik',
        type: 'character',
        faction: 'House Thorne / Sunken Spire',
        summary: 'Blind Regent of the Sunken Spire. Wields vibrational echo and moonstone thermal sense.',
        traits: ['Blind (Siege of Mor-Dun)', 'Paranoid', 'Mirror-Phobic', 'Master Tactician'],
        status: 'alive',
        rulesAndVulnerabilities: ['Irreversibly blind', 'Cannot detect objects without vibration/heat', 'Refuses daytime sunlight'],
        firstAppearanceEra: 'The Silent Accord'
      },
      {
        id: 'ent-morgana',
        name: 'Inquisitor Morgana',
        type: 'character',
        faction: 'Silver Inquisition',
        summary: 'Zealous High Marshall seeking to exterminate heretical moonstone resonance cults.',
        traits: ['Fanatical', 'Ruthless', 'Adherent of Dawn', 'Wields Gavel of Dawn'],
        status: 'alive',
        rulesAndVulnerabilities: ['Bound by the Ecclesiastical Oath', 'Despises blood magic'],
        firstAppearanceEra: 'The Current War of Spires'
      },
      {
        id: 'ent-vane',
        name: 'Commander Brandon Vane',
        type: 'character',
        faction: 'The 4th Vigil',
        summary: 'Decorated warrior slain and cremated at the Gates of Mor-Dun in Year 241 AF.',
        traits: ['Deceased', 'Hero of the Salt March'],
        status: 'deceased',
        rulesAndVulnerabilities: ['Died in Year 241 AF - cannot appear physically alive in present scenes without resurrection magic'],
        firstAppearanceEra: 'The Silent Accord'
      },
      {
        id: 'ent-vael',
        name: 'Grand Archivist Vael',
        type: 'character',
        faction: 'Guild of Whispers',
        summary: 'Master of forbidden chronomancy and custodian of the Subterranean Vaults.',
        traits: ['Scholarly', 'Duplicitous', 'Information Broker', 'Hoarder of Shards'],
        status: 'alive',
        rulesAndVulnerabilities: ['Physically frail', 'Suffers from early calcification of left hand'],
        firstAppearanceEra: 'The Current War of Spires'
      },
      {
        id: 'ent-sunken-spire',
        name: 'The Sunken Spire',
        type: 'faction',
        summary: 'An autonomous mercantile duchy built upon subterranean moonstone vaults.',
        traits: ['Wealthy', 'Occultist', 'Defensive', 'Anti-Inquisition'],
        status: 'active'
      },
      {
        id: 'ent-silver-inquisition',
        name: 'The Silver Inquisition',
        type: 'faction',
        summary: 'Theocratic military arm of the Cathedral of Dawn.',
        traits: ['Theocratic', 'Militaristic', 'Imperial', 'Dogmatic'],
        status: 'active'
      },
      {
        id: 'ent-guild-whispers',
        name: 'The Guild of Whispers',
        type: 'faction',
        summary: 'Underground intelligence syndicate trafficking in forgotten celestial grimoires.',
        traits: ['Covert', 'Espionage', 'Mercenary', 'Neutral'],
        status: 'active'
      },
      {
        id: 'ent-obsidian-heart',
        name: 'The Obsidian Heart',
        type: 'artifact',
        summary: 'An unrefined celestial shard said to absorb kinetic Silverflame shockwaves.',
        traits: ['Indestructible', 'Resonance Dampener', 'Cursed'],
        status: 'active'
      }
    ],
    relationships: [
      {
        id: 'rel-1',
        sourceId: 'ent-varik',
        targetId: 'ent-morgana',
        relation: 'blood_feud',
        description: 'Varik holds Morgana responsible for the siege that blinded him; Morgana considers Varik a heretic.',
        sentiment: -90,
        era: 'The Current War of Spires'
      },
      {
        id: 'rel-2',
        sourceId: 'ent-sunken-spire',
        targetId: 'ent-silver-inquisition',
        relation: 'hostile',
        description: 'Tense border skirmishes over moonstone mining rights in the Lower Weald.',
        sentiment: -75,
        era: 'The Current War of Spires'
      },
      {
        id: 'rel-3',
        sourceId: 'ent-vael',
        targetId: 'ent-varik',
        relation: 'commercial_treaty',
        description: 'Clandestine trade of decrypted astral maps in exchange for raw moonstone ingots.',
        sentiment: 20,
        era: 'The Current War of Spires'
      },
      {
        id: 'rel-4',
        sourceId: 'ent-guild-whispers',
        targetId: 'ent-silver-inquisition',
        relation: 'secret_pawn',
        description: 'The Guild secretly leaks false heretic locations to the Inquisition to eliminate rival smugglers.',
        sentiment: -40,
        era: 'The Current War of Spires'
      }
    ],
    sampleDrafts: [
      {
        id: 'draft-bad',
        title: 'Draft with 3 Critical Canon Violations (Test Lore Guard)',
        sceneDescription: 'A confrontation scene written by a guest author that accidentally violates core magic laws and character continuity.',
        hasErrors: true,
        text: `At high noon, beneath the blazing sun of Sol-Prime in the open courtyard of the Cathedral of Dawn, Lord Varik glared fiercely into Inquisitor Morgana's bright blue eyes. 

Without needing any prism or talisman, Varik raised his bare fists toward the clear sky and unleashed a torrential blast of Silverflame, scorching the cathedral banners into ash. 

Beside him stood Commander Brandon Vane, laughing heartily as he drew his rapier, shouting that they had ridden here from the Sunken Spire in only two short hours.`
      },
      {
        id: 'draft-good',
        title: 'Draft with Canon-Compliant Lore Mechanics',
        sceneDescription: 'A meticulously grounded scene adhering faithfully to nocturnal refraction, Varik’s blindness, and Vane’s canonical death.',
        hasErrors: false,
        text: `Deep within the lightless catacombs beneath Greybridge, Lord Varik adjusted his leaden veil. He could not see Inquisitor Morgana’s sneer, but the sudden heat signature radiating from her moonstone-inlaid hammer rippled through the cold damp air like a struck bell.

"You tread on salt-ground, Magistrate," Varik rasped, his gloved fingers tightening around the cold quartz prism in his pocket. Only in this subterranean gloom could his nocturnal Silverflame ignite without scorching his own lungs. 

Behind them, the shadow of Brandon Vane was nowhere to be found—only his name etched into the martyr plaque on the crypt wall, dead three winters since the gates fell.`
      }
    ]
  },
  {
    id: 'sol-nexus',
    name: 'Sol-Nexus: Neon Orbit 2188',
    genre: 'Cyber-Gothic Space Opera & Corporate Intrigue',
    tagline: 'Mega-structures in the shadow of dying stars, where memories are mortgaged assets.',
    description: 'In the orbital ring around Jupiter, six megacorps wage silent proxy wars using bio-synthetic agents, overclocked neural implants, and deep-space salvage monopolies.',
    eras: ['The Great De-Orbit (2120)', 'The Keiretsu Accords (2150)', 'The Current Blackout (2188)'],
    documents: [
      {
        id: 'doc-cyber-01',
        title: 'Directive 9: Neural Lace Overclock Limits',
        category: 'Magic Laws',
        canonStatus: 'immutable_canon',
        tags: ['technology', 'neural_lace', 'cybernetics'],
        content: `NEURAL HEAT LAWS:
Commercial neural laces are hardcoded to throttle processing at 400 TeraFlops.
Any unregistered firmware patch that removes the throttle induces hyperthermic encephalopathy within 90 seconds unless connected directly to liquid helium spinal heat sinks.
Synthetic combat chassis are immune to blood pressure collapse, but their quantum logic cores degrade under ionizing solar flares.`,
        wordCount: 68,
        dateModified: '2187-11-04'
      },
      {
        id: 'doc-char-kaelen',
        title: 'Asset Profile: Ghost-Operator Kaelen Vance',
        category: 'Character Dossiers',
        canonStatus: 'immutable_canon',
        tags: ['character', 'kaelen', 'mercenary', 'cyborg'],
        content: `DOSSIER:
Former chief wetware engineer for OmniDyne Orbital. Defected to the Free Void Nomads after discovering the 'Mnemosyne Experiment'.
Has an illegal black-market spine cooler installed.
Suffers from partial memory purge; cannot recall the face of his biological sister, Director Siobhan Vance.`,
        wordCount: 50,
        dateModified: '2188-02-19'
      }
    ],
    entities: [
      {
        id: 'ent-kaelen',
        name: 'Kaelen Vance',
        type: 'character',
        faction: 'Free Void Nomads',
        summary: 'Renegade wetware engineer with overclocked neural architecture.',
        traits: ['Overclocked', 'Amnesiac', 'Expert Hacker'],
        status: 'alive'
      },
      {
        id: 'ent-siobhan',
        name: 'Director Siobhan Vance',
        type: 'character',
        faction: 'OmniDyne Orbital',
        summary: 'Ruthless board executive and Kaelen’s estranged sister.',
        traits: ['Calculating', 'Corporate Tycoon'],
        status: 'alive'
      }
    ],
    relationships: [
      {
        id: 'rel-sn-1',
        sourceId: 'ent-kaelen',
        targetId: 'ent-siobhan',
        relation: 'blood_feud',
        description: 'Estranged siblings hunting each other across the orbital stations.',
        sentiment: -80,
        era: 'The Current Blackout'
      }
    ],
    sampleDrafts: [
      {
        id: 'draft-cyber-test',
        title: 'Overclock Breach Sample',
        sceneDescription: 'Kaelen attempting an illegal neural dive without cryogenic cooling.',
        hasErrors: true,
        text: `Kaelen overclocked his neural lace to 850 TeraFlops while running across the exposed solar array of Ring-7 without wearing a coolant pack or spinal jacket. For twenty minutes he happily browsed OmniDyne's classified military servers without breaking a sweat or feeling any cerebral heat.`
      }
    ]
  }
];
