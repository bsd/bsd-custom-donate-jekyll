require 'webrick'
include WEBrick
WEBrick::HTTPUtils::DefaultMimeTypes.store 'jkl', 'text/html'