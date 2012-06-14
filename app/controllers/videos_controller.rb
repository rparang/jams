class VideosController < ApplicationController
  before_filter :signed_in_user, :only => [:create, :destroy]
 
  def search
    @yt_client = YouTubeIt::Client.new
    query = params[:s]
    @vids =  @yt_client.videos_by(:query => "#{query}", :page => 1, :per_page => 10)
    @video_titles = @vids.videos.collect {|v| v.title} #User.first.followed_users.map(&:id) - consult Rails Tutorial 11.3.2
    @video_image_url = @vids.videos.collect {|v| v.thumbnails}
    @video_url = @vids.videos.collect {|v| v.player_url}
    @video_id = @vids.videos.collect {|v| v.video_id }
  end
 
  def index
    #@videos = Video.paginate(:page => params[:page], :per_page => 2)
    @vote = Vote.new(params[:vote])
    @feed_items = Video.paginate(:page => params[:page], :per_page => 10)
  end

  def video
  end

  def show
    @video = Video.find(params[:id])
    @vote = Vote.new(params[:vote])
    @comment = Comment.new(params[:vote])
    @comment_items = @video.comments
  end

  def edit
  end

  def destroy
  end

  def create
      @video = current_user.videos.build(params[:video])

      time_now = Time.now.localtime
      @last_video_created_time = current_user.videos.first.created_at

      #if (time_now - @last_video_created_time) >= 84600

        if @video.save
          flash.now[:notice] = "Video created biaatch"
          redirect_to @video
        else
          render '/pages/home'
        end

      #else

     #   render :js =>  "alert('You may vote once every 24 hours for any one item.');"

      #end

  end
  
  def update
  end

  def new
    @yt_client = YouTubeIt::Client.new
    query = params[:v]
    @vids =  @yt_client.video_by("#{query}")
    @video_image_url = @vids.thumbnails
    
    @video = Video.new

    @comment = Comment.new
  
    
  end
end