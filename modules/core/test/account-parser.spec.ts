import { expect } from 'chai';
import 'mocha';

import { AccountParser } from '../src';

// tslint:disable-next-line:max-line-length
const SAMPLE_DATA = '<Chars nextCharId="2" maxNumChars="1"><Char id="1"><ObjectType>782</ObjectType><Level>1</Level><Exp>100</Exp><CurrentFame>10</CurrentFame><Equipment>1,-1,2000,-1,3000,1500,421,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1</Equipment><MaxHitPoints>100</MaxHitPoints><HitPoints>100</HitPoints><MaxMagicPoints>150</MaxMagicPoints><MagicPoints>150</MagicPoints><Attack>15</Attack><Defense>0</Defense><Speed>20</Speed><Dexterity>20</Dexterity><HpRegen>40</HpRegen><MpRegen>20</MpRegen><HealthStackCount>1</HealthStackCount><MagicStackCount>0</MagicStackCount><Dead>False</Dead><Account><Name>HelloWorld</Name></Account>';

describe('AccountParser', () => {
  describe('#parseAccountInfo()', () => {
    it('should return the correct account info for valid inputs.', () => {
      const accInfo = AccountParser.parseAccountInfo(SAMPLE_DATA);
      expect(accInfo).to.deep.equal({
        nextCharacterId: 2,
        characterSlots: 1,
        characters: []
      }, 'Incorrect account info parsed.');
    });
    it('should return null for valid inputs with no account info.', () => {
      const info = AccountParser.parseAccountInfo('Hello, World!');
      expect(info).to.equal(null, 'Input with no account returned non-null.');
    });
    it('should throw a TypeError for invalid inputs.', () => {
      expect(() => AccountParser.parseAccountInfo(34 as any)).to.throw(TypeError);
      expect(() => AccountParser.parseAccountInfo(null)).to.throw(TypeError);
      expect(() => AccountParser.parseAccountInfo(['String', 'array'] as any)).to.throw(TypeError);
    });
  });
  describe('#parseCharacters()', () => {
    it('should return an array of characters for valid inputs.', () => {
      const chars = AccountParser.parseCharacters(SAMPLE_DATA);
      expect(chars.length).to.equal(1, 'Incorrect number of chars parsed.');
      expect(chars[0]).to.deep.equal({
        id: 1,
        playerData: {
          class: 782,
          level: 1,
          exp: 100,
          currentFame: 10,
          name: 'HelloWorld',
          inventory: [1, -1, 2000, -1, 3000, 1500, 421, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
          hp: 100,
          maxHP: 100,
          mp: 150,
          maxMP: 150,
          atk: 15,
          def: 0,
          spd: 20,
          dex: 20,
          wis: 20,
          vit: 40
        }
      }, 'Incorrect character info parsed.');
    });
    it('should return an empty array for valid inputs with no characters.', () => {
      const chars = AccountParser.parseCharacters('Hello, World!');
      expect(chars.length).to.equal(0, 'Incorrect length for empty char array.');
    });
    it('should throw a TypeError for invalid inputs.', () => {
      expect(() => AccountParser.parseCharacters(3724 as any)).to.throw(TypeError);
      expect(() => AccountParser.parseCharacters(null)).to.throw(TypeError);
      expect(() => AccountParser.parseCharacters(['Test', 'string'] as any)).to.throw(TypeError);
    });
  });
});
