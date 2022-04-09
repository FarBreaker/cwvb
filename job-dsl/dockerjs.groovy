job('DSL Docker'){
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
            tag('${GIT_REVISION,length=9}')
            registryCredentials('dockerhub')
            forcePull(false)
            forceTag(false)
            createFingerprints(false)
            skipDecorate()
        }
    }
}