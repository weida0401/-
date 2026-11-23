PRAGMA user_version = 1;

CREATE TABLE cards (
    id TEXT NOT NULL PRIMARY KEY CHECK (length(trim(id)) > 0),
    deck_index INTEGER NOT NULL UNIQUE CHECK (deck_index BETWEEN 0 AND 77),
    arcana TEXT NOT NULL CHECK (arcana IN ('major', 'minor')),
    suit TEXT,
    rank INTEGER NOT NULL,
    name_en TEXT NOT NULL UNIQUE CHECK (length(trim(name_en)) > 0),
    name_zh_hant TEXT NOT NULL UNIQUE CHECK (length(trim(name_zh_hant)) > 0),
    symbol TEXT NOT NULL CHECK (length(trim(symbol)) > 0),
    keyword_zh_hant TEXT NOT NULL CHECK (length(trim(keyword_zh_hant)) > 0),
    upright_zh_hant TEXT NOT NULL CHECK (length(trim(upright_zh_hant)) > 0),
    reversed_zh_hant TEXT NOT NULL CHECK (length(trim(reversed_zh_hant)) > 0),
    CHECK (
        (arcana = 'major' AND suit IS NULL AND rank BETWEEN 0 AND 21)
        OR (
            arcana = 'minor' AND suit IS NOT NULL
            AND suit IN ('wands', 'cups', 'swords', 'pentacles')
            AND rank BETWEEN 1 AND 14
        )
    )
);

CREATE UNIQUE INDEX cards_major_rank ON cards (rank) WHERE arcana = 'major';
CREATE UNIQUE INDEX cards_minor_suit_rank ON cards (suit, rank) WHERE arcana = 'minor';
