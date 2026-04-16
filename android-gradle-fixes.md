# Android Gradle Fixes

Changes to apply after each `npx expo prebuild` (these files are gitignored).

## android/gradle.properties

Add after `org.gradle.jvmargs`:

```properties
org.gradle.offline=true
```

> Remove this line when you need to download new dependencies.

## android/build.gradle

Line 19 — add `=` to the `url` assignment:

```groovy
maven { url = 'https://www.jitpack.io' }
```

## android/app/build.gradle

### `android` block (top-level properties)

```groovy
ndkVersion = rootProject.ext.ndkVersion
buildToolsVersion = rootProject.ext.buildToolsVersion
compileSdk = rootProject.ext.compileSdkVersion
namespace = 'com.acetone.fr1sim'
```

### `buildTypes.debug`

```groovy
signingConfig = signingConfigs.debug
```

### `buildTypes.release`

```groovy
signingConfig = signingConfigs.debug
shrinkResources = enableShrinkResources.toBoolean()
minifyEnabled = enableMinifyInReleaseBuilds
crunchPngs = enablePngCrunchInRelease.toBoolean()
```

### `packagingOptions.jniLibs`

```groovy
useLegacyPackaging = enableLegacyPackaging.toBoolean()
```

### `androidResources`

```groovy
ignoreAssetsPattern = '!.svn:!.git:!.ds_store:!*.scc:!CVS:!thumbs.db:!picasa.ini:!*~'
```
