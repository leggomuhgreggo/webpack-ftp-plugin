const FTP = require('ftp');
const PATH = require('path');
const FS = require('fs');

const C = new FTP();

function WebpackFTP(options) {
    const _ = this;

    _.config = {
        "host": options.host,
        "user": options.user,
        "password": options.password,
        "port": options.port,
        "localDist" = options.localDist;
        "remoteDist" = options.remoteDist;
    };

}

WebpackFTP.prototype.apply = function(compiler) {
    const _ = this;

    compiler.plugin('done', function() {

        C.on('ready', () => {
            FS.readdir(_.config.localDist, (err, files) => {
                if (err) throw err;

                files.forEach(file => {
                    C.put(PATH.join(_.localDist, file), PATH.join(_.config.remoteDist, file), err => {
                        if (err) throw err;
                        console.log(`${_.config.remoteDist}${file} uploaded`)
                    });
                });

                C.end();
            });
        });

        C.connect(_.config);

    });
};

module.exports = WebpackFTP;

