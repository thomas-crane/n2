/**
 * @module core/resources
 */
import { Tile } from './tile';
import { Logger, LogLevel } from '@n2/common';
import { GameObject, ProjectileInfo } from './game-object';

export class ResourceLib {

  static tiles: {
    [id: string]: Tile;
  } = {};

  static objects: {
    [id: string]: GameObject;
  } = {};
  static items: {
    [id: string]: GameObject;
  } = {};
  static enemies: {
    [id: string]: GameObject;
  } = {};
  static pets: {
    [id: string]: GameObject;
  } = {};

  /**
   * Parses the raw ground types JSON into `Tile` objects.
   * @param rawGroundTypes The ground types JSON object.
   */
  static loadGroundTypes(rawGroundTypes: any) {
    let tileArray: any[] = rawGroundTypes.Ground;
    for (const tile of tileArray) {
      try {
        this.tiles[+tile.type] = {
          type: +tile.type,
          id: tile.id,
          sink: tile.Sink ? true : false,
          speed: +tile.Speed || 1,
          noWalk: tile.NoWalk ? true : false
        };
      } catch (error) {
        Logger.log('ResourceLib', `Failed to load tile ${tile.type}`, LogLevel.Warning);
        Logger.log('ResourceLib', error.message, LogLevel.Warning);
      }
    }
    Logger.log('ResourceLib', `Loaded ${tileArray.length} tiles.`, LogLevel.Info);
    tileArray = null;
  }

  /**
   * Parses the raw objects JSON into `GameObject` objects.
   * @param rawObjects The objects JSON object.
   */
  static loadObjects(rawObjects: any) {
    let itemCount = 0;
    let enemyCount = 0;
    let petCount = 0;
    let objectsArray: any[] = rawObjects.Object;
    for (const current of objectsArray) {
      try {
        this.objects[+current.type] = {
          type: +current.type,
          id: current.id,
          enemy: (current.Enemy === '' ? true : false),
          item: (current.Item === '' ? true : false),
          god: (current.God === '' ? true : false),
          pet: (current.Pet === '' ? true : false),
          slotType: (+current.SlotType || -1),
          bagType: (+current.BagType || -1),
          class: current.Class,
          maxHitPoints: (+current.MaxHitPoints || -1),
          defense: (+current.Defense || -1),
          xpMultiplier: (+current.XpMult || -1),
          activateOnEquip: [],
          projectiles: [],
          projectile: null,
          rateOfFire: (+current.RateOfFire || -1),
          numProjectiles: (+current.NumProjectiles || -1),
          arcGap: (+current.ArcGap || -1),
          fameBonus: (+current.FameBonus || -1),
          feedPower: (+current.FeedPower || -1),
          fullOccupy: (current.FullOccupy === '' ? true : false),
          occupySquare: (current.OccupySquare === '' ? true : false),
        };
        if (Array.isArray(current.Projectile)) {
          this.objects[+current.type].projectiles = new Array<ProjectileInfo>(current.Projectile.length);
          for (let j = 0; j < current.Projectile.length; j++) {
            this.objects[+current.type].projectiles[j] = {
              id: +current.Projectile[j].id,
              objectId: current.Projectile[j].ObjectId,
              damage: (+current.Projectile[j].damage || -1),
              minDamage: (+current.Projectile[j].MinDamage || -1),
              maxDamage: (+current.Projectile[j].MaxDamage || -1),
              speed: +current.Projectile[j].Speed,
              lifetimeMS: +current.Projectile[j].LifetimeMS,
              parametric: (current.Projectile[j].Parametric === '' ? true : false),
              wavy: (current.Projectile[j].Wavy === '' ? true : false),
              boomerang: (current.Projectile[j].Boomerang === '' ? true : false),
              multihit: (current.Projectile[j].MultiHit === '' ? true : false),
              passesCover: (current.Projectile[j].PassesCover === '' ? true : false),
              frequency: (+current.Projectile[j].Frequency || 0),
              amplitude: (+current.Projectile[j].Amplitude || 0),
              magnitude: (+current.Projectile[j].Magnitude || 0),
              conditionEffects: []
            };
            if (Array.isArray(current.Projectile[j].ConditionEffect)) {
              for (const effect of current.Projectile[j].ConditionEffect) {
                this.objects[+current.type].projectiles[j].conditionEffects.push({
                  effectName: effect._,
                  duration: effect.duration
                });
              }
            } else if (typeof current.Projectile[j].ConditionEffect === 'object') {
              this.objects[+current.type].projectiles[j].conditionEffects.push({
                effectName: current.Projectile[j].ConditionEffect._,
                duration: current.Projectile[j].ConditionEffect.duration
              });
            }
          }
        } else if (typeof current.Projectile === 'object') {
          this.objects[+current.type].projectile = {
            id: +current.Projectile.id,
            objectId: current.Projectile.ObjectId,
            damage: (+current.Projectile.damage || -1),
            minDamage: (+current.Projectile.MinDamage || -1),
            maxDamage: (+current.Projectile.MaxDamage || -1),
            speed: +current.Projectile.Speed,
            lifetimeMS: +current.Projectile.LifetimeMS,
            parametric: (current.Projectile.Parametric === '' ? true : false),
            wavy: (current.Projectile.Wavy === '' ? true : false),
            boomerang: (current.Projectile.Boomerang === '' ? true : false),
            multihit: (current.Projectile.MultiHit === '' ? true : false),
            passesCover: (current.Projectile.PassesCover === '' ? true : false),
            frequency: (+current.Projectile.Frequency || 1),
            amplitude: (+current.Projectile.Amplitude || 0),
            magnitude: (+current.Projectile.Magnitude || 3),
            conditionEffects: []
          };
          this.objects[+current.type].projectiles.push(this.objects[+current.type].projectile);
        }
        // map items.
        if (this.objects[+current.type].item) {
          // stat bonuses
          if (Array.isArray(current.ActivateOnEquip)) {
            for (const bonus of current.ActivateOnEquip) {
              if (bonus._ === 'IncrementStat') {
                this.objects[+current.type].activateOnEquip.push({
                  statType: bonus.stat,
                  amount: bonus.amount
                });
              }
            }
          } else if (typeof current.ActivateOnEquip === 'object') {
            if (current.ActivateOnEquip._ === 'IncrementStat') {
              this.objects[+current.type].activateOnEquip.push({
                statType: current.ActivateOnEquip.stat,
                amount: current.ActivateOnEquip.amount
              });
            }
          }
          this.items[+current.type] = this.objects[+current.type];
          itemCount++;
        }
        // map enemies.
        if (this.objects[+current.type].enemy) {
          this.enemies[+current.type] = this.objects[+current.type];
          enemyCount++;
        }
        // map pets.
        if (this.objects[+current.type].pet) {
          this.pets[+current.type] = this.objects[+current.type];
          petCount++;
        }
      } catch {
        Logger.log('ResourceLib', `Failed to load object: ${current.type}`, LogLevel.Debug);
      }
    }
    Logger.log('ResourceLib', `Loaded ${objectsArray.length} objects.`, LogLevel.Info);
    Logger.log('ResourceLib', `Loaded ${itemCount} items.`, LogLevel.Info);
    Logger.log('ResourceLib', `Loaded ${enemyCount} enemies.`, LogLevel.Info);
    Logger.log('ResourceLib', `Loaded ${petCount} pets.`, LogLevel.Info);
    objectsArray = null;
  }
}
