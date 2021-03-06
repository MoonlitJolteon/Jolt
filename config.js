/**
 * The following are all client options for Klasa/Discord.js.
 * Any option that you wish to use the default value can be removed from this file.
 * This file is init with defaults from both Klasa and Discord.js.
 */

exports.config = {
    /**
     * General Options
     */
    // Disables/Enables a process.on('unhandledRejection'...) handler
    production: false,
    // The default language that comes with klasa. More base languages can be found on Klasa-Pieces
    language: 'en-US',
    // The default configurable prefix for each guild
    prefix: ['!', '<@!879388041595203645>'],
    // If custom settings should be preserved when a guild removes your bot
    preserveSettings: true,
    // If your bot should be able to mention @everyone
    disableEveryone: false,
    // Whether d.js should queue your rest request in 'sequential' or 'burst' mode
    apiRequestMethod: 'sequential',
    // The time in ms to add to ratelimits, to ensure you wont hit a 429 response
    restTimeOffset: 500,
    // Any Websocket Events you don't want to listen to
    disabledEvents: [],
    // A presence to login with
    presence: {},
    // A once ready message for your console
    readyMessage: (client) => {
        let msg = `Successfully initialized. Ready to serve ${client.guilds.cache.size} guild${client.guilds.cache.size === 1 ? '' : 's'}.`
        client.guilds.cache.get('757624148800569506').channels.cache.get('879397449012244480').send(msg);
        client.user.setPresence({ activity: {type: 'COMPETING', name: 'VRML with !help' }, status: 'online' })
        return msg
    },

    /**
     * Caching Options
     */
    fetchAllMembers: false,
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    commandMessageLifetime: 1800,
    // The above 2 options are ignored while the interval is 0
    messageSweepInterval: 0,

    /**
     * Sharding Options
     */
    shardId: 0,
    shardCount: 1,

    /**
     * Command Handler Options
     */
    commandEditing: false,
    commandLogging: true,
    typing: true,

    /**
     * Database Options
     */
    providers: {
        /*
        // Provider Connection object for process based databases:
        // rethinkdb, mongodb, mssql, mysql, postgresql
        mysql: {
            host: 'localhost',
            db: 'klasa',
            user: 'database-user',
            password: 'database-password',
            options: {}
        },
        */
        default: 'json'
    },

    /**
     * Custom Prompt Defaults
     */
    customPromptDefaults: {
        time: 30000,
        limit: Infinity,
        quotedStringSupport: false
    },

    /**
     * Klasa Piece Defaults
     */
    pieceDefaults: {
        commands: {
            aliases: [],
            autoAliases: true,
            bucket: 1,
            cooldown: 0,
            description: '',
            enabled: true,
            guarded: false,
            nsfw: false,
            permissionLevel: 0,
            promptLimit: 0,
            promptTime: 30000,
            requiredSettings: [],
            requiredPermissions: 0,
            runIn: ['text'],
            subcommands: false,
            usage: '',
            quotedStringSupport: false,
            deletable: false
        },
        events: {
            enabled: true,
            once: false
        },
        extendables: {
            enabled: true,
            klasa: false,
            appliesTo: []
        },
        finalizers: { enabled: true },
        inhibitors: {
            enabled: true,
            spamProtection: false
        },
        languages: { enabled: true },
        monitors: {
            enabled: true,
            ignoreBots: false,
            ignoreSelf: true,
            ignoreOthers: true,
            ignoreWebhooks: true,
            ignoreEdits: true
        },
        providers: {
            enabled: true,
            sql: false,
            cache: false
        },
        tasks: { enabled: true }
    },

    /**
     * Console Event Handlers (enabled/disabled)
     */
    consoleEvents: {
        debug: false,
        error: true,
        log: true,
        verbose: false,
        warn: true,
        wtf: true
    },

    /**
     * Console Options
     */
    console: {
        // Alternatively a Moment Timestamp string can be provided to customize the timestamps.
        timestamps: true,
        utc: false,
        colors: {
            debug: { time: { background: 'magenta' } },
            error: { time: { background: 'red' } },
            log: { time: { background: 'blue' } },
            verbose: { time: { text: 'gray' } },
            warn: { time: { background: 'lightyellow', text: 'black' } },
            wtf: { message: { text: 'red' }, time: { background: 'red' } }
        }
    },

    /**
     * Custom Setting Gateway Options
     */
    gateways: {
        guilds: {},
        users: {},
        clientStorage: {}
    },

    /**
     * Klasa Schedule Options
     */
    schedule: { interval: 60000 }
};
