module Jekyll
  module Commafy
    def commafy(input)
      input.to_s.reverse.gsub(/...(?=.)/,'\&,').reverse
    end
  end
end

Liquid::Template.register_filter(Jekyll::Commafy)