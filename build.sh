#!/bin/bash
git pull
cd fastlane && fastlane android beta && fastlane ios beta
