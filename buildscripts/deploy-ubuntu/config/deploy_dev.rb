# config valid only for current version of Capistrano
lock '3.6.0'

set :application, 'cs'
set :repo_url, 'git@git.vsii.com:jpd/Thanh-CurrencySwap.git'

# Default branch is :master
set :branch, ->{ fetch( :git_branch ) }
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, ->{ fetch( :deploy_folder ) }

# Default value for :scm is :git
set :scm, :git

set :app_user, ->{ fetch( :app_user ) }
set :app_folder, ->{ fetch( :app_folder ) }
set :app_service, ->{ fetch( :app_service , 'cs') }
set :pty, true

set :keep_releases, 3
set :backup_folder, ->{ fetch( :backup_folder ) }

namespace :deploy do

  task :checkinstalled do
	on roles(:web) do
	
		val = capture("if [ -d #{fetch(:log_folder)} ]; then echo 'yes'; else echo 'no'; fi")
		
		if val == "yes"
			print "Project is installed already, update it now.\n"
			$rq_prjsetup = false 
		else
			print "Project is not yet installed\n"
			$rq_prjsetup = true
		end
	end
  end

  task :prjsetup do
	on roles(:web) do

		sedAppFolder = fetch(:app_folder).gsub(/\//, "\\\/");
		sedMediaFolder = fetch(:media_folder).gsub(/\//, "\\\/");
		sedLogFolder = fetch(:log_folder).gsub(/\//, "\\\/");

		if $rq_prjsetup			
			print "Setup Project : #{sedAppFolder}\n";
			execute "mkdir -p #{fetch(:media_folder)}";
			execute "mkdir -p #{fetch(:log_folder)}";
		end

    execute "cat #{deploy_to}/current/src/app-config.json.template | sed 's/REDIS_HOST/#{fetch(:redis_host)}/g;s/REDIS_PORT/#{fetch(:redis_port)}/g;s/REDIS_PASSWORD/#{fetch(:redis_pass)}/g;s/REDIS_DB/#{fetch(:redis_db)}/g;s/REDIS_TTL/#{fetch(:redis_ttl)}/g;s/REDIS_PREFIX/#{fetch(:redis_prefix)}/g;s/STMP_HOST/#{fetch(:stmp_host)}/g;s/STMP_PORT/#{fetch(:stmp_port)}/g;s/STMP_USERNAME/#{fetch(:stmp_username)}/g;s/STMP_PASSWORD/#{fetch(:stmp_password)}/g;s/STMP_SECURE/#{fetch(:stmp_secure)}/g;s/MEDIA_FOLDER/#{sedMediaFolder}/g;s/LOG_FOLDER/#{sedLogFolder}/g;' > #{deploy_to}/current/src/app-config.json";
		execute "cat #{deploy_to}/current/src/server/datasources.json.template | sed 's/DBHOST/#{fetch(:dbhost)}/g;s/DBNAME/#{fetch(:dbname)}/g;s/DBPASS/#{fetch(:dbpass)}/g;s/DBUSER/#{fetch(:dbuser)}/g;' > #{deploy_to}/current/src/server/datasources.json";
		execute "ln -s #{deploy_to}/current/src/ #{ fetch(:app_folder) }";
		execute "cd #{ fetch( :app_folder ) } && npm install";
	end	
  end

  task :update_db do
	on roles :web do
		if $rq_prjsetup
			print "Migrate Data.\n"
			execute "cd #{ fetch( :app_folder ) } && ./scripts/setup.sh"
		else 
			print "Update Data.\n"
			execute "cd #{ fetch( :app_folder ) } && ./scripts/update.sh"
		end
	end
  end

  task :redis_clear_cache do
	on roles :web do
		redis_pass = fetch( :redis_pass )
		pass_opt = "-a #{redis_pass}"

		if redis_pass.nil? || redis_pass.empty?
			pass_opt = ''
		end

		if $rq_prjsetup
			print "Clear Redis Cache.\n"
			execute "redis-cli --scan --pattern '#{ fetch( :redis_prefix ) }*' #{pass_opt} -n #{ fetch( :redis_db ) } | xargs redis-cli #{pass_opt} -n #{ fetch( :redis_db ) } DEL"			
		end
	end
  end

  task :install_service do
	on roles :web do
		if $rq_prjsetup
			print "Install Service.\n"
			execute "cd #{ fetch( :app_folder ) } && pm2 start . -i 10 --name '#{ fetch( :app_service ) }' && pm2 save"
		end
	end
  end

  task :restart_service do
	on roles :web do		
		if $rq_prjsetup
			print "Startup Service.\n"			
		else 
			print "Restart Service.\n"
			execute "pm2 restart #{ fetch( :app_service ) }"
		end
	end
  end

  task :create_backup_cronjob do
	on roles :web do		
		if $rq_prjsetup
			print "Generate cronjob file.\n"
			# execute "echo '0 0 * * * #{ fetch( :app_folder ) }/scripts/backupdb.sh #{ fetch( :backup_folder ) } #{fetch(:dbname)}' > #{ fetch( :deploy_to ) }/cronjob && crontab -u #{ fetch( :app_user ) } #{ fetch( :deploy_to ) }/cronjob"
			# execute "echo '0 0 * * * #{ fetch( :app_folder ) }/scripts/cleanupdb.sh #{ fetch( :backup_folder ) }' > #{ fetch( :deploy_to ) }/cleanup_cronjob && crontab -u #{ fetch( :app_user ) } #{ fetch( :deploy_to ) }/cleanup_cronjob"
		end
	end
  end

  after :publishing, :checkinstalled
  after :checkinstalled, :prjsetup
  after :prjsetup, :update_db
  after :update_db, :redis_clear_cache
  after :redis_clear_cache, :install_service
  after :install_service, :restart_service
  after :restart_service, :create_backup_cronjob
  

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end
