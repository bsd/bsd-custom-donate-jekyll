module Reading
  class Generator < Jekyll::Generator
    def generate(site)
        puts "Hi" 
        puts site.static_files.first
    end
  end
end