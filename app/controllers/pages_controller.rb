class PagesController < ApplicationController
  
  def home
  	if signed_in?
  		@feed_items = current_user.feed
  	end
  	@videos = Video.all
    @vote = Vote.new
  end

  def user
  end
  
  def video
  end

end
