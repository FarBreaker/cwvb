job('DSL'){
    scm {
        git('https://github.com/FarBreaker/cwvb.git'){ node->
        node / gitConfigName('FarBreaker')
        node / gitConfigEmail('lorenzo@pinkdonutstudio.com')
        }
    }
    triggers {
        scm('H/5 * * * *')
    }
    wrappers{
        nodejs('16.14.2')
    }
    steps{
        dockerBuildAndPublish{
            repositoryName('farbreaker/docker-demo')
            tag('${GIT_REVISION,lenght=9}')
            registryCredential('dockerhub')
            forcePull(false)
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
        }
    }
}