class CommentsController < ApplicationController

	def new
		@comment = Comment.new(params[:id])
	end

	def create
		@comment = current_user.comments.build(params[:comment])
		if @comment.save
			respond_to do |format|
				format.html { redirect_to :back }
				format.js
			end
		else
			flash[:error] = "Something went wrong with your comment. We're looking into it."
			respond_to do |format|
				format.html { redirect_to :back }
				format.js
			end
		end
	end

	def destroy
		Comment.find(params[:id]).destroy
		flash[:success] = "Your comment was deleted. No one will ever know."
		redirect_to :back
	end

end