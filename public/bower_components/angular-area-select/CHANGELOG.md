Version numbers correspond to `bower.json` version

# 1.0.2 (2014-04-01)
## Features
- move `instId` from `attrs` to `scope` to allow setting/changing later/dynamically


# 1.0.1 (2014-01-25)
## Features
- `$scope.$on('jrgAreaSelectReInit',..` event listener added for re-initializing the directive (after it's already been written) - i.e. if the transcluded inner content changes
- `$scope.$on('jrgAreaSelectHide',..` event listener added for hiding the directive (i.e. the blurred sections)
- add `$attrs.inline`

## Bug Fixes
- switch from `getBoundingClientRect()` which was giving bad (negative/wrong) offset/coords
- add z-index:999 to blurred elements so they show up on top


# 1.0.0

## Features

## Bug Fixes

## Breaking Changes