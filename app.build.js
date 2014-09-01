({
    appDir: "./",
    baseUrl: "scripts",
    dir: "../SpaTest-dist",
    paths: {
        ko : "../lib",
        templates : "../templates",
        fixtures : "../fixtures",
        plugins : "./plugins"
    },
    modules: [
        { 
            name: "app",
            include: ["components/recentprofiles", "components/searchresults", "components/reports"]
        },
        {
            name: "components/profile",
            include: ["components/connections"]
        },
        {
            name: "components/flows",
            include: ["components/flows", "components/floweditor", "components/custidrenderer", "components/dummycomponent"]
        }
    ]
})