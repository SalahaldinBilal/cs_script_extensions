import { CSWeaponType, CSGearSlot, TraceInteracts } from './enums';

declare global {
  // Valves extended definitions
  export const Instance: Domain;

  class Domain {
    /** Log a message to the console. */
    Msg(text: string): void;
    /** Print some text to the game window. */
    DebugScreenText(text: string, x: number, y: number, duration: number, color: Color): void;
    /** Draw a wire spehere in the world. */
    DebugSphere(center: Vector, radius: number, duration: number, color: Color): void;

    /** Called in Tools mode before the script is reloaded due to changes. A returned value will be passed to the OnReload callback. */
    OnBeforeReload(callback: () => any): void;
    /** Called in Tools mode after the script reloaded due to changes while. */
    OnReload(callback: (memory: any) => void): void;

    /** Called when the point_script entity is activated */
    OnActivate(callback: () => void): void;
    /** Called when known game events are fired. See GameEventDefs for list of known game events. */
    OnGameEvent<E extends keyof GameEventDefs>(eventName: E, callback: (args: GameEventDefs[E]) => void): void;
    /** Called input RunScriptInput is triggered on the point_script entity with a value that matches. */
    OnScriptInput(name: string, callback: (context: EntIOContext) => void): void;
    /** Called per-think */
    SetThink(callback: () => void): void;
    /** Set when the think callback should next be called */
    SetNextThink(time: number): void;

    /** Fire the input on all targets matching the specified name. */
    EntFireAtName(name: string, input: string, value?: EntIOValue, delay?: number): void;
    /** Fire the input on the specified target. */
    EntFireAtTarget(target: Entity, input: string, value?: EntIOValue, delay?: number): void;
    /** Connect the output of an entity to a callback. The return value is a connection id that can be used in `DisconnectOutput` */
    ConnectOutput(target: Entity, output: string, callback: (arg: EntIOValue, context: EntIOContext) => any): number | undefined;
    /** Find entities by name. */
    DisconnectOutput(connectionId: number): void;

    /** Find the first entity matching the specified name. */
    FindEntityByName(name: string): Entity | undefined;
    /** Find entities matching the specified name. */
    FindEntitiesByName(name: string): Entity[];
    /** Find the first entity of the specified class name. */
    FindEntityByClass(className: string): Entity | undefined;
    /** Find entities of the specified class name. */
    FindEntitiesByClass(className: string): Entity[];
    /** Get the player controller in the given slot. */
    GetPlayerController(slot: number): CSPlayerController | undefined;

    /** Trace along a line and detect collisions */
    GetTraceHit(start: Vector, end: Vector, config?: TraceConfig): TraceResult;

    /** Get the game time in seconds. */
    GetGameTime(): number;
    /** Get if the game is currently in a Warmup period. */
    IsWarmupPeriod(): boolean;
    /** Get the current Game Type. */
    GetGameType(): number;
    /** Get the current Game Mode. */
    GetGameMode(): number;
    /** Get the name of the current map. */
    GetMapName(): string;
    /** Get the number of rounds played in the current game. */
    GetRoundsPlayed(): number;

    /** Issue the specified command to the specified client. */
    ClientCommand(slot: number, command: string): void;
    /** Issue a command. */
    ServerCommand(command: string): void;
  }

  type Vector = { x: number, y: number, z: number };
  type QAngle = { pitch: number, yaw: number, roll: number };
  type Color = { r: number, g: number, b: number, a?: number };
  type EntIOValue = boolean | number | string | Vector | Color | undefined;
  type EntIOContext = { caller?: Entity, activator?: Entity };
  interface TraceConfig {
    ignoreEnt?: Entity, // Set to ignore collisions with an entity, typically the source of a trace
    interacts?: TraceInteracts, // Defaults to trace against any solid
    sphereRadius?: number; // Set to trace a sphere with specified radius
  }

  interface TraceResult {
    fraction: number;
    end: Vector;
    didHit: boolean;
    hitEnt?: Entity | null;
  }

  type GrenadeGiveNamesList = "weapon_flashbang" | "weapon_hegrenade" | "weapon_smokegrenade" | "weapon_molotov" | "weapon_frag" |
    "weapon_incgrenade" | "weapon_decoy" | "weapon_tagrenade";
  type WeaponGiveNamesList = "weapon_scar20" | "weapon_snowball" | "weapon_revolver" | "weapon_firebomb" |
    "weapon_m249" | "weapon_shield" | "weapon_mac10" | "weapon_ak47" | "weapon_deagle" | "weapon_m4a1" | "weapon_tec9" | "weapon_knife_t" |
    "weapon_xm1014" | "weapon_p250" | "weapon_famas" | "weapon_aug" | "weapon_mp5sd" | "weapon_mag7" | "weapon_c4" | "item_assaultsuit" | "weapon_bizon" |
    "weapon_ssg08" | "weapon_knife" | "item_kevlar" | "weapon_ump45" | "weapon_galilar" | "weapon_mp9" | "weapon_p90" | "weapon_tablet" | "weapon_hkp2000" |
    "weapon_diversion" | "weapon_glock" | "weapon_bumpmine" | "weapon_awp" | "weapon_sawedoff" | "weapon_taser" | "weapon_elite" |
    "weapon_mp7" | "weapon_sg556" | "weapon_breachcharge" | "weapon_nova" | "weapon_healthshot" | "weapon_m4a1_silencer" |
    "weapon_fiveseven" | "item_assaultsuit" | "weapon_cz75a" | "weapon_usp_silencer" | "weapon_g3sg1" | "weapon_negev" | GrenadeGiveNamesList;
  type WeaponGiveNames = WeaponGiveNamesList | (string & {});

  interface GameEventDefs {
    /** Send once a server starts */
    "server_spawn": {
      /** public host name */
      hostname: string,
      /** hostame, IP or DNS name */
      address: string,
      /** server port */
      port: number,
      /** game dir */
      game: string,
      /** map name */
      mapname: string,
      /** addon name */
      addonname: string,
      /** max players */
      maxplayers: number,
      /** WIN32, LINUX */
      os: string,
      /** true if dedicated server */
      dedicated: boolean,
      /** true if password protected */
      password: boolean
    },
    /** Server is about to be shut down */
    "server_pre_shutdown": {
      /** reason why server is about to be shut down */
      reason: string
    },
    /** Server shut down */
    "server_shutdown": {
      /** reason why server was shut down */
      reason: string
    },
    /** A generic server message */
    "server_message": {
      /** the message text */
      text: string
    },
    /** A server console var has changed */
    "server_cvar": {
      /** cvar name, eg "mp_roundtime" */
      cvarname: string,
      /** new cvar value */
      cvarvalue: string
    },
    "player_activate": {
      /** user ID on server */
      userid: number
    },
    /** Player has sent final message in the connection sequence */
    "player_connect_full": {
      /** user ID on server (unique on server) */
      userid: number
    },
    "player_full_update": {
      /** user ID on server */
      userid: number,
      /** Number of this full update */
      count: number
    },
    /** A new client connected */
    "player_connect": {
      /** player name */
      name: string,
      /** user ID on server (unique on server) */
      userid: number,
      /** player network (i.e steam) id */
      networkid: string,
      /** steam id */
      xuid: number,
      /** ip:port */
      address: string,
      bot: boolean
    },
    /** A client was disconnected */
    "player_disconnect": {
      /** user ID on server */
      userid: number,
      /** see networkdisconnect enum protobuf */
      reason: number,
      /** player name */
      name: string,
      /** player network (i.e steam) id */
      networkid: string,
      /** steam id */
      xuid: number,
      PlayerID: number
    },
    /** A player changed his name */
    "player_info": {
      /** player name */
      name: string,
      /** user ID on server (unique on server) */
      userid: number,
      /** player network (i.e steam) id */
      steamid: number,
      /** true if player is a AI bot */
      bot: boolean
    },
    /** Player spawned in game */
    "player_spawn": {
      userid: number
    },
    /** Player change his team. You can receive this on the client before the local player has updated the team field locally */
    "player_team": {
      /** player */
      userid: number,
      /** team id */
      team: number,
      /** old team id */
      oldteam: number,
      /** team change because player disconnects */
      disconnect: boolean,
      silent: boolean,
      /** true if player is a bot */
      isbot: boolean
    },
    /** Sent only on the client for the local player - happens only after a local players pawn team variable has been updated */
    "local_player_team": {

    },
    /** Sent only on the client for the local player - happens only after the local players controller team variable has been updated */
    "local_player_controller_team": {

    },
    "player_changename": {
      /** user ID on server */
      userid: number,
      /** players old (current) name */
      oldname: string,
      /** players new name */
      newname: string
    },
    "player_hurt": {
      /** player index who was hurt */
      userid: number,
      /** player index who attacked */
      attacker: number,
      /** remaining health points */
      health: number,
      /** remaining armor points */
      armor: number,
      /** weapon name attacker used, if not the world */
      weapon: WeaponGiveNames,
      /** damage done to health */
      dmg_health: number,
      /** damage done to armor */
      dmg_armor: number,
      /** hitgroup that was damaged */
      hitgroup: number
    },
    /** A public player chat */
    "player_chat": {
      /** true if team only chat */
      teamonly: boolean,
      /** chatting player */
      userid: number,
      /** chat text */
      text: string
    },
    "local_player_pawn_changed": {

    },
    /** Emits a sound to everyone on a team */
    "teamplay_broadcast_audio": {
      /** unique team id */
      team: number,
      /** name of the sound to emit */
      sound: string
    },
    "finale_start": {
      rushes: number
    },
    "player_stats_updated": {
      forceupload: boolean
    },
    /** Fired when achievements/stats are downloaded from Steam or XBox Live */
    "user_data_downloaded": {

    },
    "ragdoll_dissolved": {
      entindex: number
    },
    /** Info about team */
    "team_info": {
      /** unique team id */
      teamid: number,
      /** team name eg "Team Blue" */
      teamname: string
    },
    /** Team score changed */
    "team_score": {
      /** team id */
      teamid: number,
      /** total team score */
      score: number
    },
    /** A spectator/player is a cameraman */
    "hltv_cameraman": {
      /** camera man entity index */
      userid: number
    },
    /** Shot of a single entity */
    "hltv_chase": {
      /** primary traget index */
      target1: number,
      /** secondary traget index or 0 */
      target2: number,
      /** camera distance */
      distance: number,
      /** view angle horizontal */
      theta: number,
      /** view angle vertical */
      phi: number,
      /** camera inertia */
      inertia: number,
      /** diretcor suggests to show ineye */
      ineye: number
    },
    /** A camera ranking */
    "hltv_rank_camera": {
      /** fixed camera index */
      index: number,
      /** ranking, how interesting is this camera view */
      rank: number,
      /** best/closest target entity */
      target: number
    },
    /** An entity ranking */
    "hltv_rank_entity": {
      /** player slot */
      userid: number,
      /** ranking, how interesting is this entity to view */
      rank: number,
      /** best/closest target entity */
      target: number
    },
    /** Show from fixed view */
    "hltv_fixed": {
      /** camera position in world */
      posx: number,
      posy: number,
      posz: number,
      /** camera angles */
      theta: number,
      phi: number,
      offset: number,
      fov: number,
      /** follow this player */
      target: number
    },
    /** A HLTV message send by moderators */
    "hltv_message": {
      text: string
    },
    /** General HLTV status */
    "hltv_status": {
      /** number of HLTV spectators */
      clients: number,
      /** number of HLTV slots */
      slots: number,
      /** number of HLTV proxies */
      proxies: number,
      /** disptach master IP:port */
      master: string
    },
    "hltv_title": {
      text: string
    },
    /** A HLTV chat msg sent by spectators */
    "hltv_chat": {
      text: string,
      /** steam id */
      steamID: number
    },
    "hltv_versioninfo": {
      version: number
    },
    "hltv_replay": {
      /** number of seconds in killer replay delay */
      delay: number,
      /** reason for replay	(ReplayEventType_t) */
      reason: number
    },
    "map_shutdown": {

    },
    "map_transition": {

    },
    "hostname_changed": {
      hostname: string
    },
    "difficulty_changed": {
      newDifficulty: number,
      oldDifficulty: number,
      /** new difficulty as string */
      strDifficulty: string
    },
    /** A message send by game logic to everyone */
    "game_message": {
      /** 0 = console, 1 = HUD */
      target: number,
      /** the message text */
      text: string
    },
    /** Send when new map is completely loaded */
    "game_newmap": {
      /** map name */
      mapname: string
    },
    "round_start": {
      /** round time limit in seconds */
      timelimit: number,
      /** frag limit in seconds */
      fraglimit: number,
      /** round objective */
      objective: string
    },
    "warmup_end": {

    },
    "round_end": {
      /** winner team/user i */
      winner: number,
      /** reson why team won */
      reason: number,
      /** end round message */
      message: string,
      /** server-generated legacy value */
      legacy: number,
      /** total number of players alive at the end of round, used for statistics gathering, computed on the server in the event client is in replay when receiving this message */
      player_count: number,
      /** if set, don't play round end music, because action is still on-going */
      nomusic: number
    },
    "round_start_pre_entity": {

    },
    "round_start_post_nav": {

    },
    "round_freeze_end": {

    },
    /** Round restart */
    "teamplay_round_start": {
      /** is this a full reset of the map */
      full_reset: boolean
    },
    /** A game event, name may be 32 characters long */
    "player_death": {
      /** user who died */
      userid: number,
      /** player who killed */
      attacker: number,
      /** player who assisted in the kill */
      assister: number,
      /** assister helped with a flash */
      assistedflash: boolean,
      /** weapon name killer used */
      weapon: WeaponGiveNames,
      /** inventory item id of weapon killer used */
      weapon_itemid: string,
      /** faux item id of weapon killer used */
      weapon_fauxitemid: string,
      weapon_originalowner_xuid: string,
      /** singals a headshot */
      headshot: boolean,
      /** did killer dominate victim with this kill */
      dominated: number,
      /** did killer get revenge on victim with this kill */
      revenge: number,
      /** is the kill resulting in squad wipe */
      wipe: number,
      /** number of objects shot penetrated before killing target */
      penetrated: number,
      /** if replay data is unavailable, this will be present and set to false */
      noreplay: boolean,
      /** kill happened without a scope, used for death notice icon */
      noscope: boolean,
      /** hitscan weapon went through smoke grenade */
      thrusmoke: boolean,
      /** attacker was blind from flashbang */
      attackerblind: boolean,
      /** distance to victim in meters */
      distance: number,
      /** damage done to health */
      dmg_health: number,
      /** damage done to armor */
      dmg_armor: number,
      /** hitgroup that was damaged */
      hitgroup: number,
      /** attacker was in midair */
      attackerinair: boolean
    },
    "player_footstep": {
      userid: number
    },
    "player_hintmessage": {
      /** localizable string of a hint */
      hintmessage: string
    },
    "break_breakable": {
      entindex: number,
      userid: number,
      /** BREAK_GLASS, BREAK_WOOD, etc */
      material: number
    },
    "break_prop": {
      entindex: number,
      userid: number
    },
    "entity_killed": {
      entindex_killed: number,
      entindex_attacker: number,
      entindex_inflictor: number,
      damagebits: number
    },
    "door_close": {
      /** Who closed the door */
      userid: number,
      /** Is the door a checkpoint door */
      checkpoint: boolean
    },
    "vote_started": {
      issue: string,
      param1: string,
      team: number,
      /** entity id of the player who initiated the vote */
      initiator: number
    },
    "vote_failed": {
      team: number
    },
    "vote_passed": {
      details: string,
      param1: string,
      team: number
    },
    "vote_changed": {
      vote_option1: number,
      vote_option2: number,
      vote_option3: number,
      vote_option4: number,
      vote_option5: number,
      potentialVotes: number
    },
    "vote_cast_yes": {
      team: number,
      /** entity id of the voter */
      entityid: number
    },
    "vote_cast_no": {
      team: number,
      /** entity id of the voter */
      entityid: number
    },
    "achievement_event": {
      /** non-localized name of achievement */
      achievement_name: string,
      /** # of steps toward achievement */
      cur_val: number,
      /** total # of steps in achievement */
      max_val: number
    },
    "achievement_earned": {
      /** entindex of the player */
      player: number,
      /** achievement ID */
      achievement: number
    },
    /** Used for a notification message when an achievement fails to write */
    "achievement_write_failed": {

    },
    "bonus_updated": {
      numadvanced: number,
      numbronze: number,
      numsilver: number,
      numgold: number
    },
    "spec_target_updated": {
      /** spectating player */
      userid: number,
      /** ehandle of the target */
      target: number
    },
    "spec_mode_updated": {
      /** entindex of the player */
      userid: number
    },
    "entity_visible": {
      /** The player who sees the entity */
      userid: number,
      /** Entindex of the entity they see */
      subject: number,
      /** Classname of the entity they see */
      classname: string,
      /** name of the entity they see */
      entityname: string
    },
    "gameinstructor_draw": {

    },
    "gameinstructor_nodraw": {

    },
    "flare_ignite_npc": {
      /** entity ignited */
      entindex: number
    },
    "helicopter_grenade_punt_miss": {

    },
    "physgun_pickup": {
      /** entity picked up */
      target: number
    },
    "inventory_updated": {

    },
    "cart_updated": {

    },
    "store_pricesheet_updated": {

    },
    "item_schema_initialized": {

    },
    "drop_rate_modified": {

    },
    "event_ticket_modified": {

    },
    "gc_connected": {

    },
    "instructor_start_lesson": {
      /** The player who this lesson is intended for */
      userid: number,
      /** Name of the lesson to start.  Must match instructor_lesson.txt */
      hint_name: string,
      /** entity id that the hint should display at. Leave empty if controller target */
      hint_target: number,
      vr_movement_type: number,
      vr_single_controller: boolean,
      vr_controller_type: number
    },
    "instructor_close_lesson": {
      /** The player who this lesson is intended for */
      userid: number,
      /** Name of the lesson to start.  Must match instructor_lesson.txt */
      hint_name: string
    },
    /** Create a hint using data supplied entirely by the server/map. Intended for hints to smooth playtests before content is ready to make the hint unneccessary. NOT INTENDED AS A SHIPPABLE CRUTCH */
    "instructor_server_hint_create": {
      /** user ID of the player that triggered the hint */
      userid: number,
      /** what to name the hint. For referencing it again later (e.g. a kill command for the hint instead of a timeout) */
      hint_name: string,
      /** type name so that messages of the same type will replace each other */
      hint_replace_key: string,
      /** entity id that the hint should display at */
      hint_target: number,
      /** userid id of the activator */
      hint_activator_userid: number,
      /** how long in seconds until the hint automatically times out, 0 = never */
      hint_timeout: number,
      /** the hint icon to use when the hint is onscreen. e.g. "icon_alert_red" */
      hint_icon_onscreen: string,
      /** the hint icon to use when the hint is offscreen. e.g. "icon_alert" */
      hint_icon_offscreen: string,
      /** the hint caption. e.g. "#ThisIsDangerous" */
      hint_caption: string,
      /** the hint caption that only the activator sees e.g. "#YouPushedItGood" */
      hint_activator_caption: string,
      /** the hint color in "r,g,b" format where each component is 0-255 */
      hint_color: string,
      /** how far on the z axis to offset the hint from entity origin */
      hint_icon_offset: number,
      /** range before the hint is culled */
      hint_range: number,
      /** hint flags */
      hint_flags: number,
      /** bindings to use when use_binding is the onscreen icon */
      hint_binding: string,
      /** gamepad bindings to use when use_binding is the onscreen icon */
      hint_gamepad_binding: string,
      /** if false, the hint will dissappear if the target entity is invisible */
      hint_allow_nodraw_target: boolean,
      /** if true, the hint will not show when outside the player view */
      hint_nooffscreen: boolean,
      /** if true, the hint caption will show even if the hint is occluded */
      hint_forcecaption: boolean,
      /** if true, only the local player will see the hint */
      hint_local_player_only: boolean
    },
    "clientside_lesson_closed": {
      lesson_name: string
    },
    "dynamic_shadow_light_changed": {

    },
    "gameui_hidden": {

    },
    "items_gifted": {
      /** entity used by player */
      player: number,
      itemdef: number,
      numgifts: number,
      giftidx: number,
      accountid: number
    },
    /** Players scores changed */
    "player_score": {
      /** user ID on server */
      userid: number,
      /** # of kills */
      kills: number,
      /** # of deaths */
      deaths: number,
      /** total game score */
      score: number
    },
    /** Player shoot his weapon */
    "player_shoot": {
      /** user ID on server */
      userid: number,
      /** weapon ID */
      weapon: number,
      /** weapon mode */
      mode: number
    },
    /** Sent when a new game is started */
    "game_init": {

    },
    /** A new game starts */
    "game_start": {
      /** max round */
      roundslimit: number,
      /** time limit */
      timelimit: number,
      /** frag limit */
      fraglimit: number,
      /** round objective */
      objective: string
    },
    /** A game ended */
    "game_end": {
      /** winner team/user id */
      winner: number
    },
    "round_announce_match_point": {

    },
    "round_announce_final": {

    },
    "round_announce_last_round_half": {

    },
    "round_announce_match_start": {

    },
    "round_announce_warmup": {

    },
    "round_end_upload_stats": {

    },
    "round_officially_ended": {

    },
    "round_time_warning": {

    },
    "ugc_map_info_received": {
      published_file_id: number
    },
    "ugc_map_unsubscribed": {
      published_file_id: number
    },
    "ugc_map_download_error": {
      published_file_id: number,
      error_code: number
    },
    "ugc_file_download_finished": {
      /** id of this specific content (may be image or map) */
      hcontent: number
    },
    "ugc_file_download_start": {
      /** id of this specific content (may be image or map) */
      hcontent: number,
      /** id of the associated content package */
      published_file_id: number
    },
    /** Fired when a match ends or is restarted */
    "begin_new_match": {

    },
    "dm_bonus_weapon_start": {
      /** The length of time that this bonus lasts */
      time: number,
      /** Loadout position of the bonus weapon */
      Pos: number
    },
    "survival_announce_phase": {
      /** The phase # */
      phase: number
    },
    "broken_breakable": {
      entindex: number,
      userid: number,
      /** BREAK_GLASS, BREAK_WOOD, etc */
      material: number
    },
    "player_decal": {
      userid: number
    },
    "set_instructor_group_enabled": {
      group: string,
      enabled: number
    },
    /** Destroys a server/map created hint */
    "instructor_server_hint_stop": {
      /** The hint to stop. Will stop ALL hints with this name */
      hint_name: string
    },
    /** Read user titledata from profile */
    "read_game_titledata": {
      /** Controller id of user */
      controllerId: number
    },
    /** Write user titledata in profile */
    "write_game_titledata": {
      /** Controller id of user */
      controllerId: number
    },
    /** Reset user titledata; do not automatically write profile */
    "reset_game_titledata": {
      /** Controller id of user */
      controllerId: number
    },
    "weaponhud_selection": {
      /** Player who this event applies to */
      userid: number,
      /** EWeaponHudSelectionMode (switch / pickup / drop) */
      mode: number,
      /** Weapon entity index */
      entindex: number
    },
    "vote_ended": {

    },
    "vote_cast": {
      /** which option the player voted on */
      vote_option: number,
      team: number,
      /** player who voted */
      userid: number
    },
    "vote_options": {
      /** Number of options - up to MAX_VOTE_OPTIONS */
      count: number,
      option1: string,
      option2: string,
      option3: string,
      option4: string,
      option5: string
    },
    "endmatch_mapvote_selecting_map": {
      /** Number of "ties" */
      count: number,
      slot1: number,
      slot2: number,
      slot3: number,
      slot4: number,
      slot5: number,
      slot6: number,
      slot7: number,
      slot8: number,
      slot9: number,
      slot10: number
    },
    "endmatch_cmm_start_reveal_items": {

    },
    "client_loadout_changed": {

    },
    "add_player_sonar_icon": {
      userid: number,
      pos_x: number,
      pos_y: number,
      pos_z: number
    },
    "add_bullet_hit_marker": {
      userid: number,
      bone: number,
      pos_x: number,
      pos_y: number,
      pos_z: number,
      ang_x: number,
      ang_y: number,
      ang_z: number,
      start_x: number,
      start_y: number,
      start_z: number,
      hit: boolean
    },
    "other_death": {
      /** other entity ID who died */
      otherid: number,
      /** other entity type */
      othertype: string,
      /** user ID who killed */
      attacker: number,
      /** weapon name killer used */
      weapon: WeaponGiveNames,
      /** inventory item id of weapon killer used */
      weapon_itemid: string,
      /** faux item id of weapon killer used */
      weapon_fauxitemid: string,
      weapon_originalowner_xuid: string,
      /** singals a headshot */
      headshot: boolean,
      /** number of objects shot penetrated before killing target */
      penetrated: number,
      /** kill happened without a scope, used for death notice icon */
      noscope: boolean,
      /** hitscan weapon went through smoke grenade */
      thrusmoke: boolean,
      /** attacker was blind from flashbang */
      attackerblind: boolean
    },
    "item_purchase": {
      userid: number,
      team: number,
      loadout: number,
      weapon: WeaponGiveNames
    },
    "bomb_beginplant": {
      /** player who is planting the bomb */
      userid: number,
      /** bombsite index */
      site: number
    },
    "bomb_abortplant": {
      /** player who is planting the bomb */
      userid: number,
      /** bombsite index */
      site: number
    },
    "bomb_planted": {
      /** player who planted the bomb */
      userid: number,
      /** bombsite index */
      site: number
    },
    "bomb_defused": {
      /** player who defused the bomb */
      userid: number,
      /** bombsite index */
      site: number
    },
    "bomb_exploded": {
      /** player who planted the bomb */
      userid: number,
      /** bombsite index */
      site: number
    },
    "bomb_dropped": {
      /** player who dropped the bomb */
      userid: number,
      entindex: number
    },
    "bomb_pickup": {
      /** player pawn who picked up the bomb */
      userid: number
    },
    "defuser_dropped": {
      /** defuser's entity ID */
      entityid: number
    },
    "defuser_pickup": {
      /** defuser's entity ID */
      entityid: number,
      /** player who picked up the defuser */
      userid: number
    },
    "announce_phase_end": {

    },
    "cs_intermission": {

    },
    "bomb_begindefuse": {
      /** player who is defusing */
      userid: number,
      haskit: boolean
    },
    "bomb_abortdefuse": {
      /** player who was defusing */
      userid: number
    },
    "hostage_follows": {
      /** player who touched the hostage */
      userid: number,
      /** hostage entity index */
      hostage: number
    },
    "hostage_hurt": {
      /** player who hurt the hostage */
      userid: number,
      /** hostage entity index */
      hostage: number
    },
    "hostage_killed": {
      /** player who killed the hostage */
      userid: number,
      /** hostage entity index */
      hostage: number
    },
    "hostage_rescued": {
      /** player who rescued the hostage */
      userid: number,
      /** hostage entity index */
      hostage: number,
      /** rescue site index */
      site: number
    },
    "hostage_stops_following": {
      /** player who rescued the hostage */
      userid: number,
      /** hostage entity index */
      hostage: number
    },
    "hostage_rescued_all": {

    },
    "hostage_call_for_help": {
      /** hostage entity index */
      hostage: number
    },
    "vip_escaped": {
      /** player who was the VIP */
      userid: number
    },
    "vip_killed": {
      /** player who was the VIP */
      userid: number,
      /** user ID who killed the VIP */
      attacker: number
    },
    "player_radio": {
      userid: number,
      slot: number
    },
    "bomb_beep": {
      /** c4 entity */
      entindex: number
    },
    "weapon_fire": {
      userid: number,
      /** weapon name used */
      weapon: WeaponGiveNames,
      /** is weapon silenced */
      silenced: boolean
    },
    "weapon_fire_on_empty": {
      userid: number,
      /** weapon name used */
      weapon: WeaponGiveNames
    },
    "grenade_thrown": {
      userid: number,
      /** weapon name used */
      weapon: GrenadeGiveNamesList
    },
    "weapon_outofammo": {
      userid: number
    },
    "weapon_reload": {
      userid: number
    },
    "weapon_zoom": {
      userid: number
    },
    "silencer_detach": {
      userid: number
    },
    "inspect_weapon": {
      userid: number
    },
    /** Exists for the game instructor to let it know when the player zoomed in with a regular rifle. Different from the above weapon_zoom because we don't use this event to notify bots */
    "weapon_zoom_rifle": {
      userid: number
    },
    "player_spawned": {
      userid: number,
      /** true if restart is pending */
      inrestart: boolean
    },
    "item_pickup": {
      userid: number,
      /** either a weapon such as 'tmp' or 'hegrenade', or an item such as 'nvgs' */
      item: string,
      silent: boolean,
      defindex: number
    },
    "item_pickup_slerp": {
      userid: number,
      index: number,
      behavior: number
    },
    "item_pickup_failed": {
      userid: number,
      item: string,
      reason: number,
      limit: number
    },
    "item_remove": {
      userid: number,
      /** either a weapon such as 'tmp' or 'hegrenade', or an item such as 'nvgs' */
      item: string,
      defindex: number
    },
    "ammo_pickup": {
      userid: number,
      /** either a weapon such as 'tmp' or 'hegrenade', or an item such as 'nvgs' */
      item: string,
      /** the weapon entindex */
      index: number
    },
    "item_equip": {
      userid: number,
      /** either a weapon such as 'tmp' or 'hegrenade', or an item such as 'nvgs' */
      item: string,
      defindex: number,
      canzoom: boolean,
      hassilencer: boolean,
      issilenced: boolean,
      hastracers: boolean,
      weptype: number,
      ispainted: boolean
    },
    "enter_buyzone": {
      userid: number,
      canbuy: boolean
    },
    "exit_buyzone": {
      userid: number,
      canbuy: boolean
    },
    "buytime_ended": {

    },
    "enter_bombzone": {
      userid: number,
      hasbomb: boolean,
      isplanted: boolean
    },
    "exit_bombzone": {
      userid: number,
      hasbomb: boolean,
      isplanted: boolean
    },
    "enter_rescue_zone": {
      userid: number
    },
    "exit_rescue_zone": {
      userid: number
    },
    "silencer_off": {
      userid: number
    },
    "silencer_on": {
      userid: number
    },
    "buymenu_open": {
      userid: number
    },
    "buymenu_close": {
      userid: number
    },
    /** Sent before all other round restart actions */
    "round_prestart": {

    },
    /** Sent after all other round restart actions */
    "round_poststart": {

    },
    "grenade_bounce": {
      userid: number
    },
    "hegrenade_detonate": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "flashbang_detonate": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "smokegrenade_detonate": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "smokegrenade_expired": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "molotov_detonate": {
      userid: number,
      x: number,
      y: number,
      z: number
    },
    "decoy_detonate": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "decoy_started": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "tagrenade_detonate": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "inferno_startburn": {
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "inferno_expire": {
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "inferno_extinguish": {
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "decoy_firing": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number
    },
    "bullet_impact": {
      userid: number,
      x: number,
      y: number,
      z: number
    },
    "player_jump": {
      userid: number
    },
    "player_blind": {
      userid: number,
      /** user ID who threw the flash */
      attacker: number,
      /** the flashbang going off */
      entityid: number,
      blind_duration: number
    },
    "player_falldamage": {
      userid: number,
      damage: number
    },
    "door_moving": {
      userid: number,
      entindex: number
    },
    "mb_input_lock_success": {

    },
    "mb_input_lock_cancel": {

    },
    "nav_blocked": {
      area: number,
      blocked: boolean
    },
    "nav_generate": {

    },
    "achievement_info_loaded": {

    },
    "hltv_changed_mode": {
      oldmode: number,
      newmode: number,
      obs_target: number
    },
    "cs_game_disconnected": {

    },
    "cs_round_final_beep": {

    },
    "cs_round_start_beep": {

    },
    "cs_win_panel_round": {
      show_timer_defend: boolean,
      show_timer_attack: boolean,
      timer_time: number,
      /** define in cs_gamerules.h */
      final_event: number,
      funfact_token: string,
      funfact_player: number,
      funfact_data1: number,
      funfact_data2: number,
      funfact_data3: number
    },
    "cs_win_panel_match": {

    },
    "cs_match_end_restart": {

    },
    "cs_pre_restart": {

    },
    "show_deathpanel": {
      /** endindex of the one who was killed */
      victim: number,
      /** entindex of the killer entity */
      killer: number,
      killer_controller: number,
      hits_taken: number,
      damage_taken: number,
      hits_given: number,
      damage_given: number
    },
    "hide_deathpanel": {

    },
    "player_avenged_teammate": {
      avenger_id: number,
      avenged_player_id: number
    },
    "achievement_earned_local": {
      /** achievement ID */
      achievement: number,
      /** splitscreen ID */
      splitscreenplayer: number
    },
    "repost_xbox_achievements": {
      /** splitscreen ID */
      splitscreenplayer: number
    },
    "match_end_conditions": {
      frags: number,
      max_rounds: number,
      win_rounds: number,
      time: number
    },
    "round_mvp": {
      userid: number,
      reason: number,
      value: number,
      musickitmvps: number,
      nomusic: number,
      musickitid: number
    },
    "show_survival_respawn_status": {
      loc_token: string,
      duration: number,
      userid: number
    },
    "client_disconnect": {

    },
    "gg_killed_enemy": {
      /** user ID who died */
      victimid: number,
      /** user ID who killed */
      attackerid: number,
      /** did killer dominate victim with this kill */
      dominated: number,
      /** did killer get revenge on victim with this kill */
      revenge: number,
      /** did killer kill with a bonus weapon? */
      bonus: boolean
    },
    "switch_team": {
      /** number of active players on both T and CT */
      numPlayers: number,
      /** number of spectators */
      numSpectators: number,
      /** average rank of human players */
      avg_rank: number,
      numTSlotsFree: number,
      numCTSlotsFree: number
    },
    "write_profile_data": {

    },
    /** Fired when a player runs out of time in trial mode */
    "trial_time_expired": {
      /** player whose time has expired */
      userid: number
    },
    /** Fired when it's time to update matchmaking data at the end of a round. */
    "update_matchmaking_stats": {

    },
    "player_reset_vote": {
      userid: number,
      vote: boolean
    },
    "enable_restart_voting": {
      enable: boolean
    },
    "sfuievent": {
      action: string,
      data: string,
      slot: number
    },
    "start_vote": {
      userid: number,
      type: number,
      vote_parameter: number
    },
    "player_given_c4": {
      /** user ID who received the c4 */
      userid: number
    },
    "tr_player_flashbanged": {
      /** user ID of the player banged */
      userid: number
    },
    "tr_mark_complete": {
      complete: number
    },
    "tr_mark_best_time": {
      time: number
    },
    "tr_exit_hint_trigger": {

    },
    "bot_takeover": {
      userid: number,
      botid: number
    },
    "tr_show_finish_msgbox": {

    },
    "tr_show_exit_msgbox": {

    },
    "jointeam_failed": {
      userid: number,
      /** 0 = team_full */
      reason: number
    },
    "teamchange_pending": {
      userid: number,
      toteam: number
    },
    "material_default_complete": {

    },
    "cs_prev_next_spectator": {
      next: boolean
    },
    /** A game event, name may be 32 characters long */
    "nextlevel_changed": {
      nextlevel: string,
      mapgroup: string,
      skirmishmode: string
    },
    "seasoncoin_levelup": {
      userid: number,
      category: number,
      rank: number
    },
    "tournament_reward": {
      defindex: number,
      totalrewards: number,
      accountid: number
    },
    "start_halftime": {

    },
    "ammo_refill": {
      userid: number,
      success: boolean
    },
    "parachute_pickup": {
      userid: number
    },
    "parachute_deploy": {
      userid: number
    },
    "dronegun_attack": {
      userid: number
    },
    "drone_dispatched": {
      userid: number,
      priority: number,
      drone_dispatched: number
    },
    "loot_crate_visible": {
      /** player entindex */
      userid: number,
      /** crate entindex */
      subject: number,
      /** type of crate (metal, wood, or paradrop) */
      type: string
    },
    "loot_crate_opened": {
      /** player entindex */
      userid: number,
      /** type of crate (metal, wood, or paradrop) */
      type: string
    },
    "open_crate_instr": {
      /** player entindex */
      userid: number,
      /** crate entindex */
      subject: number,
      /** type of crate (metal, wood, or paradrop) */
      type: string
    },
    "smoke_beacon_paradrop": {
      userid: number,
      paradrop: number
    },
    "survival_paradrop_spawn": {
      entityid: number
    },
    "survival_paradrop_break": {
      entityid: number
    },
    "drone_cargo_detached": {
      userid: number,
      cargo: number,
      delivered: boolean
    },
    "drone_above_roof": {
      userid: number,
      cargo: number
    },
    "choppers_incoming_warning": {
      global: boolean
    },
    "firstbombs_incoming_warning": {
      global: boolean
    },
    "dz_item_interaction": {
      /** player entindex */
      userid: number,
      /** crate entindex */
      subject: number,
      /** type of crate (metal, wood, or paradrop) */
      type: string
    },
    "survival_teammate_respawn": {
      userid: number
    },
    "survival_no_respawns_warning": {
      userid: number
    },
    "survival_no_respawns_final": {
      userid: number
    },
    "player_ping": {
      userid: number,
      entityid: number,
      x: number,
      y: number,
      z: number,
      urgent: boolean
    },
    "player_ping_stop": {
      entityid: number
    },
    "player_sound": {
      userid: number,
      radius: number,
      duration: number,
      step: boolean
    },
    "guardian_wave_restart": {

    },
    "team_intro_start": {

    },
    "team_intro_end": {

    },
    "bullet_flight_resolution": {
      userid: number,
      pos_x: number,
      pos_y: number,
      pos_z: number,
      ang_x: number,
      ang_y: number,
      ang_z: number,
      start_x: number,
      start_y: number,
      start_z: number
    },
    "door_break": {
      entindex: number,
      dmgstate: number
    },
    "door_closed": {
      entindex: number
    },
    "door_open": {
      entindex: number
    },
    "game_phase_changed": {
      new_phase: number
    }
  }

  export class Entity {
    IsValid(): boolean;
    GetAbsOrigin(): Vector;
    GetLocalOrigin(): Vector;
    GetAbsAngles(): QAngle;
    GetLocalAngles(): QAngle;
    GetAbsVelocity(): Vector;
    GetLocalVelocity(): Vector;
    GetEyeAngles(): QAngle;
    GetEyePosition(): Vector;
    Teleport(newPosition: Vector | null, newAngles: QAngle | null, newVelocity: Vector | null): void;
    GetClassName(): string;
    GetEntityName(): string;
    SetEntityName(name: string): void;
    GetTeamNumber(): number;
    GetHealth(): number;
    SetHealth(health: number): void;
    GetMaxHealth(): number;
    SetMaxHealth(health: number): void;
    Kill(): void;
    Remove(): void;
  }

  export class BaseModelEntity extends Entity {
    SetModel(modelName: string): void;
    SetModelScale(scale: number): void;
    SetColor(color: Color): void;
    Glow(color?: Color): void;
    Unglow(): void;
  }

  export class CSWeaponBase extends BaseModelEntity {
    GetData(): CSWeaponData;
  }

  export class CSWeaponData {
    GetName(): string;
    GetType(): CSWeaponType;
    GetPrice(): number;
  }

  export class CSPlayerController extends Entity {
    GetPlayerSlot(): number;
    GetPlayerPawn(): CSPlayerPawn | undefined;
    GetObserverPawn(): CSObserverPawn | undefined;
    GetScore(): number;
    /** Add to the player's score. Negative values are allowed but the score will not go below zero. */
    AddScore(points: number): void;
    /** Leave team as the default to use the player's current team. */
    GetWeaponDataForLoadoutSlot(slot: number, team?: number): CSWeaponData | undefined;
    IsObserving(): boolean;
    IsBot(): boolean;
    JoinTeam(team: number): void;
  }

  export class CSObserverPawn extends BaseModelEntity {
    GetPlayerController(): CSPlayerController | undefined;
    GetObserverMode(): number;
    SetObserverMode(nMode: number): void;
  }

  export class CSPlayerPawn extends BaseModelEntity {
    GetPlayerController(): CSPlayerController | undefined;
    FindWeapon(name: string): CSWeaponBase | undefined;
    FindWeaponBySlot(slot: CSGearSlot): CSWeaponBase | undefined;
    GetActiveWeapon(): CSWeaponBase | undefined;
    DestroyWeapon(target: CSWeaponBase | undefined): void;
    DestroyWeapons(): void;
    SwitchToWeapon(target: CSWeaponBase | undefined): void;
    GiveNamedItem(name: WeaponGiveNames, autoDeploy?: boolean): void;
    GetArmor(): number;
    SetArmor(value: number): void;
  }

  export class PointTemplate extends Entity {
    ForceSpawn(origin?: Vector, angle?: QAngle): Entity[] | undefined;
  }
}

export { }