class CreateAgents < ActiveRecord::Migration[8.1]
  def change
    create_table :agents do |t|
      t.string :full_name, null: false
      t.string :email, null: false
      t.string :phone
      t.string :agency_name

      t.timestamps
    end
  end
end
