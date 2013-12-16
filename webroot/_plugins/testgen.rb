###
__END__
module Reading
    class Generator < Jekyll::Generator
        def generate(site)
            site.static_files.clone.each do |sf|
              if sf.kind_of?(Jekyll::StaticFile) && sf.path =~ /\.js$/ && !(sf.path =~ /\.min\.js$/)
                site.static_files.delete(sf)
                name = File.basename(sf.path)
                destination = File.dirname(sf.path).sub(site.source, '')
                site.static_files << MinJsFile.new(site, site.source, destination, name)
              end
            end
        end
    end
end