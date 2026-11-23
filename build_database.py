"""Build a SQLite copy of the versioned tarot card data."""

import argparse
from contextlib import closing
import json
import os
from pathlib import Path
import sqlite3
from tempfile import TemporaryDirectory


ROOT = Path(__file__).resolve().parent
SUITS = ("wands", "cups", "swords", "pentacles")
COLUMNS = (
    "id", "deck_index", "arcana", "suit", "rank", "name_en", "name_zh_hant",
    "symbol", "keyword_zh_hant", "upright_zh_hant", "reversed_zh_hant",
)
TEXT_COLUMNS = set(COLUMNS) - {"deck_index", "suit", "rank"}


def load_cards():
    cards = json.loads((ROOT / "data" / "cards.json").read_text(encoding="utf-8"))
    expected_positions = [("major", None, rank) for rank in range(22)]
    expected_positions.extend(
        ("minor", suit, rank) for suit in SUITS for rank in range(1, 15)
    )
    if not isinstance(cards, list) or len(cards) != len(expected_positions):
        raise ValueError("cards.json must contain exactly 78 cards")

    for index, (card, position) in enumerate(zip(cards, expected_positions)):
        if not isinstance(card, dict) or set(card) != set(COLUMNS):
            raise ValueError(f"Card at deck index {index} has unexpected fields")
        if type(card["deck_index"]) is not int or card["deck_index"] != index:
            raise ValueError(f"Unexpected deck_index for card at position {index}")
        if type(card["rank"]) is not int or (
            card["arcana"], card["suit"], card["rank"]
        ) != position:
            raise ValueError(f"Unexpected arcana, suit or rank at deck index {index}")
        for field in TEXT_COLUMNS:
            value = card[field]
            if not isinstance(value, str) or not value.strip():
                raise ValueError(f"Missing or invalid {field} at deck index {index}")

    return cards


def build(output, replace):
    cards = load_cards()
    schema = (ROOT / "schema.sql").read_text(encoding="utf-8")
    columns = ", ".join(COLUMNS)
    placeholders = ", ".join("?" for _ in COLUMNS)
    rows = [tuple(card[field] for field in COLUMNS) for card in cards]

    with TemporaryDirectory(dir=output.parent) as temporary_dir:
        database = Path(temporary_dir) / "tarot.sqlite3"
        with closing(sqlite3.connect(database)) as connection, connection:
            connection.executescript(schema)
            connection.executemany(
                f"INSERT INTO cards ({columns}) VALUES ({placeholders})", rows
            )
            if connection.execute("PRAGMA integrity_check").fetchall() != [("ok",)]:
                raise RuntimeError("SQLite integrity check failed")

        if replace:
            database.replace(output)
        else:
            os.link(database, output)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "tarot.sqlite3")
    parser.add_argument("--replace", action="store_true", help="overwrite the output")
    options = parser.parse_args()

    try:
        build(options.output, options.replace)
    except FileExistsError:
        parser.exit(1, f"Output already exists: {options.output}\n")
    except (OSError, ValueError, sqlite3.Error, RuntimeError) as error:
        parser.exit(1, f"Build failed: {error}\n")
    print(f"Built {options.output}")


if __name__ == "__main__":
    main()
