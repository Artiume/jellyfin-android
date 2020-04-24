var deviceId;
var deviceName;
var appName;
var appVersion;

var features = [
    'filedownload',
    'displaylanguage',
    'externalplayerintent',
    'subtitleappearancesettings',
    'sharing',
    'exit',
    'htmlaudioautoplay',
    'htmlvideoautoplay',
    'externallinks',
    'multiserver',
    'physicalvolumecontrol',
    'remotecontrol',
    'castmenuhashchange'
];

function getDeviceProfile(profileBuilder, item) {
    var profile = profileBuilder({
        enableMkvProgressive: false
    });

    profile.CodecProfiles = profile.CodecProfiles.filter(function (i) {
        return i.Type == 'Audio';
    });

    profile.SubtitleProfiles.push(
        {
            Format: 'ssa',
            Method: 'External'
        },
        {
            Format: 'ass',
            Method: 'External'
        }
    );

    profile.CodecProfiles.push({
        Type: 'Video',
        Container: 'avi',
        Conditions: [
            {
                Condition: 'NotEqual',
                Property: 'CodecTag',
                Value: 'xvid'
            }
        ]
    });
    
    // https://superuser.com/questions/489087/what-are-the-differences-between-h-264-profiles
    // https://developer.android.com/guide/topics/media/media-formats
    // With the issues of transcoding, high may need to be removed.
    profile.CodecProfiles.push({
        Type: 'Video',
        Codec: 'h264',
        Conditions: [
        {
            Condition: 'EqualsAny',
            Property: 'VideoProfile',
            Value: 'main|baseline|constrained baseline' // high|
        },
        {
            Condition: 'LessThanEqual',
            Property: 'VideoLevel',
            Value: '41'
        },
 // https://forum.videohelp.com/threads/360190-Is-avc1-the-same-for-H-264-MPEG-4-AVC
 // Android client currently doesn't support avc1. 
        {
            Condition: 'NotEqual',
            Property: 'CodecTag',
            Value: 'avc1'
        }]
    });

    profile.TranscodingProfiles.reduce(function (profiles, p) {
        if (p.Type == 'Video' && p.CopyTimestamps == true && p.VideoCodec == 'h264') {
            p.AudioCodec += ',ac3';
            profiles.push(p);
        }
        return profiles;
    }, []);

    return profile;
};

function getDeviceProfileForVideo(item) {
    var container = item.Container;
    var videoTracks = audioTracks = subtitleTracks = [];

    for (var i = 0; i < item.MediaStreams.lengh; i++) {
        var track = item.MediaStreams[i];

        switch (track.Type) {
            case 'Video':
                videoTracks.push(parseVideoTrack(track));
                break;
            case 'Audio':
                audioTracks.push(parseAudioTrack(track));
                break;
            case 'Subtitle':
                subtitleTracks.push(parseSubtitleTrack(track));
                break;
            default:
                continue;
        }
    }

    var supportedTracks = window.ExoPlayer.checkTracksSupport(container, videoTracks, audioTracks, subtitleTracks);
    // TODO: check if the given tracks are supported. If not, they are not added up to directPlayProfiles
}

function parseVideoTrack(track) {
    return {
        codec: track.Codec,
        bitRate: track.BitRate,
        width: track.Width,
        height: track.Height,
        frameRate: track.RealFrameRate
    };
}

function parseAudioTrack(track) {
    return {
        codec: track.Codec,
        bitRate: track.BitRate,
        channelCount: track.Channels,
        sampleRate: track.SampleRate
    };
}

function parseSubtitleTrack(track) {
    return {
        codec: track.Codec
    };
}

module.exports = {
    exit: function () {
        if (navigator.app && navigator.app.exitApp) {
            navigator.app.exitApp();
        } else {
            window.close();
        }
    },
    supports: function (command) {
        return features.indexOf(command.toLowerCase()) != -1;
    },
    getSyncProfile: getDeviceProfile,
    getDefaultLayout: function() {
        return 'mobile';
    },
    getDeviceProfile: getDeviceProfile,
    init: function() {
        return new Promise(function(resolve, reject) {
            document.addEventListener("deviceready", function () {
                window.NativeShell.getDeviceInformation(function(result) {
                    // set globally so they can be used elsewhere
                    deviceId = result.deviceId;
                    deviceName = result.deviceName;
                    appName = result.appName;
                    appVersion = result.appVersion;

                    appInfo = {
                        deviceId: deviceId,
                        deviceName: deviceName,
                        appName: appName,
                        appVersion: appVersion
                    };

                    resolve(appInfo);
                }, function(err) {
                    console.log(err);
                    reject();
                });
            }, false);
        });
    },
    deviceName: function() {
        return deviceName;
    },
    deviceId: function() {
        return deviceId;
    },
    appName: function() {
        return appName;
    },
    appVersion: function() {
        return appVersion;
    }
};
