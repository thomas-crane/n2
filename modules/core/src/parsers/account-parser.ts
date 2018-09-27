/**
 * @module core/parsers
 */
import { Character, AccountInfo } from '../models';
import { PlayerData } from '@n2/common';

const CHAR_INFO_REGEX = /<Chars nextCharId="(\d+)" maxNumChars="(\d+)"/;
const NAME_REGEX = /<Account><Name>([A-Za-z]+)<\/Name>/;
// tslint:disable-next-line:max-line-length
const CHAR_REGEX = /<Char id="(\d+)"><ObjectType>(\d+)<\/ObjectType><Level>(\d+)<\/Level><Exp>(\d+)<\/Exp><CurrentFame>(\d+)<\/CurrentFame><Equipment>([0-9,-]+)<\/Equipment><MaxHitPoints>(\d+)<\/MaxHitPoints><HitPoints>(\d+)<\/HitPoints><MaxMagicPoints>(\d+)<\/MaxMagicPoints><MagicPoints>(\d+)<\/MagicPoints><Attack>(\d+)<\/Attack><Defense>(\d+)<\/Defense><Speed>(\d+)<\/Speed><Dexterity>(\d+)<\/Dexterity><HpRegen>(\d+)<\/HpRegen><MpRegen>(\d+)<\/MpRegen>/g;

/**
 * A parser for interpreting the XML data retrieved from the /char/list API endpoint.
 */
export class AccountParser {
  /**
   * Parses the account information from the `xml`, or
   * returns null if there is no account info in the xml.
   * @param xml The xml to parse.
   */
  static parseAccountInfo(xml: string): AccountInfo {
    if (typeof xml !== 'string') {
      throw new TypeError(`Parameter "xml" must be a string, not ${typeof xml}`);
    }
    const match = CHAR_INFO_REGEX.exec(xml);
    if (match) {
      return {
        nextCharacterId: +match[1],
        characterSlots: +match[2],
        characters: []
      };
    } else {
      return null;
    }
  }
  /**
   * Parses the characters from the `xml`, or returns an
   * empty array if there are no characters in the xml.
   * @param xml The xml to parse.
   */
  static parseCharacters(xml: string): Character[] {
    if (typeof xml !== 'string') {
      throw new TypeError(`Parameter "xml" must be a string, not ${typeof xml}`);
    }
    const chars: Character[] = [];
    let match = CHAR_REGEX.exec(xml);
    const nameMatch = NAME_REGEX.exec(xml);
    let name: string;
    if (nameMatch) {
      name = nameMatch[1];
    }
    while (match) {
      chars.push({
        id: +match[1],
        playerData: {
          name,
          class: +match[2],
          level: +match[3],
          exp: +match[4],
          currentFame: +match[5],
          inventory: match[6].split(',').map((i) => +i),
          maxHP: +match[7],
          hp: +match[8],
          maxMP: +match[9],
          mp: +match[10],
          atk: +match[11],
          def: +match[12],
          spd: +match[13],
          dex: +match[14],
          vit: +match[15],
          wis: +match[16],
        } as PlayerData
      });
      match = CHAR_REGEX.exec(xml);
    }
    return chars;
  }
}
