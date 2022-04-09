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
        shell('npm install')
    }
}